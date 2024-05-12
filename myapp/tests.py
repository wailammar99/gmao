from django.test import TestCase
from .models import *
import requests 
import unittest
import logging
class TestDeleteUserAPI(unittest.TestCase):
    
    def test_delete_user_not_found(self):
        # Envoyer une requête DELETE à l'API avec un ID invalide
        response = requests.delete('http://127.0.0.1:8000/delete_service/800/')

        # Vérifier si l'API renvoie une erreur 404 (utilisateur non trouvé)
        self.assertTrue(404, 404)

        # Vérifier si le message d'erreur correspond
        print("user not found ")
    def test_delete_user_success(self):
        # Envoyer une requête DELETE à l'API
        response = requests.delete('http://127.0.0.1:8000/delete_service/40/')

        # Vérifier si la requête a réussi (status code 200)
        self.assertEqual(200, 200)

        # Vérifier si le message de réussite est renvoyé
        print("User est supprimer ")


    # Vous pouvez ajouter d'autres tests pour vérifier différents scénarios

if __name__ == '__main__':
    unittest.main()
# Create your tests here.
class Rapportapi(unittest.TestCase):
    def create_rapport(self):
        rapport_cible=Rapport.objects.get(id=3)
        rapport_cible.generate_rapport("2024-05-12","2024-05-12")
        
        
