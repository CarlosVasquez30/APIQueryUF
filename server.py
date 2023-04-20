import datetime
from fastapi import FastAPI


from models.UFsii import UFsii

app = FastAPI()
currentDateTime = datetime.datetime.now()
date = currentDateTime.date()
yearNow = int(date.strftime("%Y"))
monthNow = int(date.strftime("%m"))

def convertirMes(numero, mes):
    meses = {
        1: "enero",
        2: "febrero",
        3: "marzo",
        4: "abril",
        5: "mayo",
        6: "junio",
        7: "julio",
        8: "agosto",
        9: "septiembre",
        10: "octubre",
        11: "noviembre",
        12: "diciembre"
    }
    if numero == 0:
        for key, value in meses.items():
            if value == mes:
                return str(key)
    else:
        return meses[numero]

@app.get("/titulo")
def read_root():
    return {"mensaje": "API para obtener el valor de la UF"}

@app.get("/uf/{day}-{month}-{year}")
def get_uf(year: int, month: int , day: int):
    print(year, yearNow)
    if month > 12 or month < 1:
        return {
            "status": "ERROR",
            "mensaje": "El mes ingresado es incorrecto [" + str(month) + "]"
        }
    if (year < 2013 or year > yearNow):
        return {
            "status": "ERROR",
            "mensaje": "El año ingresado es incorrecto [" + str(year) + "]"
        }
    if (year == yearNow and month > monthNow):
        return {
            "status": "ERROR",
            "mensaje": "El mes ingresado es incorrecto [" + str(month) + "]"
        }
    if (day > 31 or day < 1):
        return {
            "status": "ERROR",
            "mensaje": "El día ingresado es incorrecto [" + str(day) + "]"
        }
    uf = UFsii(year, convertirMes(month,""), day)
    uf.get_data()

    if uf.valor == "error/year":
        return {
            "status": "ERROR",
            "mensaje": "El año ingresado es incorrecto ( " + str(year) + " )"
        }
    elif uf.valor == "error/month":
        return {
            "status": "ERROR",
            "mensaje": "El mes ingresado es incorrecto ( " + str(month) + " )"
        }

    return {
        "status": "OK",
        "mensaje": {"UF": uf.valor,
        "fecha": str(uf.day) + "-" + convertirMes(0,uf.month) + "-" + str(uf.year)}
    }


