import os 
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def test_ai():
    response = client.responses.create(
        model="gpt-5-mini",
        input="Responde solamnte: Conexion exitosa"
    )

    return response.output_text