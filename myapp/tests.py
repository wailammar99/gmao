from django.test import TestCase
import requests 
import unittest
import logging
class TestDeleteUserAPI(unittest.TestCase):
    def test_delete_user_success(self):
        # Envoyer une requête DELETE à l'API
        response = requests.delete('http://127.0.0.1:8000/delete_service/30/')

        # Vérifier si la requête a réussi (status code 200)
        self.assertFalse(response.status_code, 741)

        # Vérifier si le message de réussite est renvoyé
        print("User est supprimer ")

    def test_delete_user_not_found(self):
        # Envoyer une requête DELETE à l'API avec un ID invalide
        response = requests.delete('http://127.0.0.1:8000/delete_service/800/')

        # Vérifier si l'API renvoie une erreur 404 (utilisateur non trouvé)
        self.assertTrue(response.status_code, 404)

        # Vérifier si le message d'erreur correspond
        print("user not found ")

    # Vous pouvez ajouter d'autres tests pour vérifier différents scénarios

if __name__ == '__main__':
    unittest.main()
# Create your tests here.
