import bcrypt

password = input("Escribe la contraseña a encriptar: ")
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print("Hash generado:\n", hashed.decode('utf-8'))