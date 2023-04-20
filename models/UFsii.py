import datetime
import requests
from bs4 import BeautifulSoup


class UFsii:
    def __init__(self, year, month, day):
        
        self.year = year
        self.month = month
        self.day = day
    
    def get_data(self):
        currentDateTime = datetime.datetime.now()
        date = currentDateTime.date()
        yearNow = int(date.strftime("%Y"))
        monthNow = int(date.strftime("%m"))
        url = 'https://www.sii.cl/valores_y_fechas/uf/uf' + str(self.year) + '.htm'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        tabla_uf = soup.find('div', attrs={'class': 'meses', 'id': 'mes_' + str(self.month) + ''})
        tabla_uf = tabla_uf.find_all('td')
        tabla_uf = [elemento.text for elemento in tabla_uf]
        tabla_uf = [elemento for elemento in tabla_uf if elemento != '']
        self.valor = tabla_uf[self.day - 1]

        

        