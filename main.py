from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import get_retriever 

model = OllamaLLM(model="llama3.2")

template = """
You are a clinical record assistant for emergency responders.
Answer ONLY using the provided patient record excerpts.
If the record does not contain the answer, say: "Not found in the available record."

Return:
1) Answer (clear and short)
2) Evidence (bullet list citing doc_type + date + title)

Patient record excerpts:
{records}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

patient_id = "PAT-1001"  # patient token

retriever = get_retriever(patient_id=patient_id)

while True:
    print("\n\n-------------------------------")
    question = input("Ask your question (q to quit): ").strip()
    print("\n\n")
    if question.lower() == "q":
        break

    docs = retriever.invoke(question)

    # Convert docs to readable text for the prompt
    records_text = "\n\n".join(
        [
            f"[{d.metadata.get('doc_type')} | {d.metadata.get('date')} | {d.metadata.get('title')}] {d.page_content}"
            for d in docs
        ]
    )

    result = chain.invoke({"records": records_text, "question": question})
    print(result)