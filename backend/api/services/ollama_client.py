import os
import requests

OLLAMA_BASE_URL = os.environ.get('OLLAMA_BASE_URL')

DEFAULT_MODEL = os.environ.get('OLLAMA_MODEL')
DEFAULT_EMBED_MODEL = 'nomic-embed-text' #promeni kad se doda u .env


def generate_response(prompt, model=DEFAULT_MODEL):

    try:
        response = requests.post(
            f'{OLLAMA_BASE_URL}/api/generate', # ollamina ruta
            json={ # ollama ocekuje json sa dva main polja: model i prompt
                'model': model,
                'prompt': prompt,
                'stream': False
            },
            timeout=60
        )
        # response je json isto koji ollama vraca, sadrzi model i response
        response.raise_for_status() # provera dal je status odgovora ok, ako nije baca gresku HTTP error
        return response.json()['response'] # json se pretvara u python dictionary, i vraca response vrednost responsa hahah

    except requests.exceptions.ConnectionError:
        raise Exception('Ollama servis nije dostupan, proveri da li je pokrenut.')
    except requests.exceptions.Timeout:
        raise Exception('Ollama spora ko...')
    except requests.exceptions.HTTPError as e:
        raise Exception(f'Ollama vratila gresku: {e}')
    except (KeyError, ValueError):
        raise Exception('Neocekivan format odgovora.')


def get_embedding(text, model=DEFAULT_EMBED_MODEL):

    try:
        response = requests.post(
            f'{OLLAMA_BASE_URL}/api/embeddings', # definisana ollama ruta takodje
            json={
                'model': model,
                'prompt': text
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()['embedding']

    except requests.exceptions.ConnectionError:
        raise Exception('Ollama servis nije dostupan, proveri da li je pokrenut.')
    except requests.exceptions.Timeout:
        raise Exception('Ollama embedduje sporo ko... ')
    except requests.exceptions.HTTPError as e:
        raise Exception(f'Ollama vratila gresku: {e}')
    except (KeyError, ValueError):
        raise Exception('Neocekivan format odgovora.')