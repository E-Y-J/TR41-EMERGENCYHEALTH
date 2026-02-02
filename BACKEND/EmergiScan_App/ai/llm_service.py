# EmergiScan_App/ai/llm_service.py
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

DEFAULT_MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

_tokenizer = None
_model = None
_device = None


def _get_device() -> str:
    # Prefer Apple Silicon GPU via MPS if available
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def _load_model_once():
    """
    Load tokenizer/model once per process and move model to device once.
    This avoids huge per-request overhead.
    """
    global _tokenizer, _model, _device

    if _tokenizer is not None and _model is not None and _device is not None:
        return

    _device = _get_device()

    _tokenizer = AutoTokenizer.from_pretrained(DEFAULT_MODEL_ID)

    # Some models don't have pad_token set; make it safe for generation
    if _tokenizer.pad_token_id is None and _tokenizer.eos_token_id is not None:
        _tokenizer.pad_token = _tokenizer.eos_token

    # Use float16 on MPS for better performance (works well on Apple Silicon)
    model_kwargs = {}
    if _device == "mps":
        model_kwargs["torch_dtype"] = torch.float16

    _model = AutoModelForCausalLM.from_pretrained(DEFAULT_MODEL_ID, **model_kwargs)
    _model.eval()
    _model.to(_device)


def generate_reply(patient_snapshot: dict, chat_history: list, user_message: str) -> str:
    """
    Minimal Hugging Face inference function.

    - patient_snapshot: dict shown to the model as the only facts it can use
    - chat_history: list of previous messages (optional context; we keep it small)
    - user_message: the new question
    """
    _load_model_once()

    # Debug print (as you requested)
    print("\n=== LLM SERVICE CALL ===")
    print("patient_snapshot:")
    print(patient_snapshot)
    print("========================\n")

    # Keep history short for speed (last 6 messages only)
    # This helps reduce prompt length and improve latency.
    recent_history = (chat_history or [])[-6:]

    # Strong “Answer Contract” rules + mechanical constraints guidance
    system_rules = """
You are the EmergiScan AI assistant for emergency responders.

ANSWER CONTRACT (must follow):
- Output ONLY the information requested by the user.
- Max 2 sentences. No repetition. No extra categories.
- Use ONLY the facts in PATIENT_SNAPSHOT_JSON. Do not invent anything.
- If info is missing, say exactly: Not recorded.
- Do NOT include allergies/conditions/medications unless the user explicitly asks.
- If the user asks about emergency contact: return ONLY name + phone.
  Include relationship ONLY if the user explicitly asks for relationship.
"""

    # Build a compact history string (optional but helpful)
    # We do not include long histories to keep it fast.
    history_lines = []
    for m in recent_history:
        role = (m.get("role") or "").strip().lower()
        content = (m.get("content") or "").strip()
        if not content:
            continue
        if role not in ("user", "assistant"):
            continue
        history_lines.append(f"{role.upper()}: {content}")
    history_text = "\n".join(history_lines)

    # Serialize snapshot compactly (smaller prompt than Python dict repr)
    snapshot_json = json.dumps(patient_snapshot, ensure_ascii=False)

    prompt = f"""{system_rules}

CHAT_HISTORY:
{history_text}

PATIENT_SNAPSHOT_JSON:
{snapshot_json}

USER:
{user_message}

ASSISTANT:
"""

    # Tokenize
    inputs = _tokenizer(prompt, return_tensors="pt")
    inputs = {k: v.to(_device) for k, v in inputs.items()}

    # Mechanical limits for speed + concision
    # - do_sample=False: deterministic, less rambling
    # - max_new_tokens small: faster, short answers
    # - repetition_penalty + no_repeat_ngram_size: reduces looping
    with torch.no_grad():
        output_ids = _model.generate(
            **inputs,
            max_new_tokens=60,
            do_sample=False,
            repetition_penalty=1.2,
            no_repeat_ngram_size=3,
            eos_token_id=_tokenizer.eos_token_id,
            pad_token_id=_tokenizer.pad_token_id,
        )

    decoded = _tokenizer.decode(output_ids[0], skip_special_tokens=True)

    # Safer extraction: remove the prompt prefix if present
    if decoded.startswith(prompt):
        reply = decoded[len(prompt):].strip()
    else:
        # Fallback: try splitting by "ASSISTANT:"
        reply = decoded.split("ASSISTANT:", 1)[-1].strip()

    # Final tiny cleanup: avoid accidental long trailing fragments
    # Keep at most ~500 chars to prevent runaway outputs in edge cases
    if len(reply) > 500:
        reply = reply[:500].rsplit(" ", 1)[0] + "…"

    return reply