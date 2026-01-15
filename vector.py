import os
import pandas as pd
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

CSV_PATH = "patient_records.csv"
DB_LOCATION = "./chroma_patient_db"
COLLECTION_NAME = "patient_records"

embeddings = OllamaEmbeddings(model="mxbai-embed-large")

def build_or_load_vectorstore():
    add_documents = not os.path.exists(DB_LOCATION)

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=DB_LOCATION,
        embedding_function=embeddings
    )

    if add_documents:
        df = pd.read_csv(CSV_PATH)

        documents = []
        ids = []

        for _, row in df.iterrows():
            doc_id = str(row["DocID"])
            patient_id = str(row["PatientID"])
            doc_type = str(row["DocType"])

            title = str(row.get("Title", ""))
            text = str(row.get("Text", ""))

            # Page content should carry the important info for retrieval
            page_content = f"{title}\n{text}"

            documents.append(
                Document(
                    page_content=page_content,
                    metadata={
                        "patient_id": patient_id,
                        "doc_type": doc_type,
                        "date": str(row.get("Date", "")),
                        "title": title,
                        "source_id": str(row.get("SourceID", "")),
                    },
                )
            )
            ids.append(doc_id)

        vector_store.add_documents(documents=documents, ids=ids)

    return vector_store


_VECTOR_STORE = None

def get_retriever(patient_id: str, k: int = 6):
    global _VECTOR_STORE
    if _VECTOR_STORE is None:
        _VECTOR_STORE = build_or_load_vectorstore()

    # filter by patient_id to prevent cross-patient leakage
    return _VECTOR_STORE.as_retriever(
        search_kwargs={
            "k": k,
            "filter": {"patient_id": patient_id},
        }
    )