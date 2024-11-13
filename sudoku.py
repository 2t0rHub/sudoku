import random

class Sudoku:
    def __init__(self):
        # Crea un sudoku vacío .
        self.content = [0 for i in range(81)]
        self.availables = [9 for i in range(81)]
        self.debug = 0

     
    def __str__(self):
        # GOAT Method para imprimir los sudokus.
        result = ""
        for i in range(len(self.content)):
            if i != 0:
                # Saltos de línea
                if i % 9 == 0:
                    result += "\n"
                # Separación de cuadrados vertical
                elif i % 3 == 0 :
                    result += " │"

                # Separación de cuadrados horizontal
                if i %27 == 0:
                    result += "───────┼───────┼───────\n"  
            
            result += " "
            # Añadir los números  
            result += str(self.content[i] if self.content[i] != 0 else "·")
        result += "\n"
        return result
    
    def print_availables(self):
        # GOAT Method para imprimir los sudokus.
        result = ""
        for i in range(len(self.content)):
            if i != 0:
                # Saltos de línea
                if i % 9 == 0:
                    result += "\n"
                # Separación de cuadrados vertical
                elif i % 3 == 0 :
                    result += " │"

                # Separación de cuadrados horizontal
                if i %27 == 0:
                    result += "───────┼───────┼───────\n"  
            
            result += " "
            # Añadir los números  
            result += str(self.availables[i] if self.availables[i] != 0 else "·")
        result += "\n"
        print(result)


    ''' FUNCIONES DE AÑADIR Y BORRAR'''
    def add(self, pos, number):
        # Añade el elemento number en la posición pos.

        if pos >= 81 or pos < 0:
            raise TypeError(f"Invalid position: {pos}")
        if number <= 0 or number > 9:
            raise TypeError(f"Invalid number: {number}")
    
        self.content[pos] = number
        self.update_available_numbers()

    def remove(self, pos: int):

        #Borra el elemento que haya en una posición.
        if pos >= 81 or pos < 0:
            raise ValueError(f"Invalid position: {pos}")
        
        self.content[pos] = 0
        self.update_available_numbers()


    ''' FUNCIONES NECESARIAS PARA AVERIGUAR POSICIONES '''
    def get_current_row(self, pos: int):
        return pos // 9

    def get_full_row(self, row: int):
        # Devuelve tofos los números de la fila. Esta es la más fácil de las 3.

        return self.content[9 * row : 9 * row + 9]

    def get_current_column(self, pos: int):
        return pos % 9

    def get_full_column(self, column: int):
        # Usa list comprehension para crear la lista. 
        # Devuelve todos los números cuyas posiciones con congruentes con column (mod 9).

        return [self.content[column + 9*i ] for i in range(9)]

    def get_current_square(self, pos: int):
        current_row = self.get_current_row(pos)
        current_column = self.get_current_column(pos)
        current_square = [current_row //3, current_column // 3]
        return current_square

    def get_full_square(self, square: list[int, int]):
        # Me comí un poco la cabeza para esta.
        # Utiliza los índices necesarios para situar el cuadrado y después los añade a full_square
        # (La "primera casilla" de cada cuadrado es la SUPERIOR IZQUIERDA, para que sea todo más fácil.)

        full_square = []
        for i in range(3):
            for elem in self.content[(9 * 3 * square[0]) + 3 * square[1] + 9*i:
                                            (9 * 3* square[0]) + 3 * square[1] + 3 + 9*i] :
                full_square.append(elem)
        
        return full_square

    ''' FUNCIÓN GRANDE Y ÚTIL. '''
    def get_available_numbers(self, pos: int):
        # Encuentra la fila, columna y cuadrado de la posición pos.
        current_row = self.get_current_row(pos)
        current_column = self.get_current_column(pos)
        current_square = self.get_current_square(pos) 

        full_row =self.get_full_row(current_row)
        full_column = self.get_full_column(current_column)

        # Recopilación del cuadrado entero
        full_square = self.get_full_square(current_square)

        # Uso de sets para averiguar los elementos disponibles
        not_available = set(set(full_row) | set(full_column) |set(full_square)) #Unión de 3 conjuntos.
        available = list(set([i for i in range(1, 10)]) - not_available) 
    
        # print("Position:", current_row,"", current_column)
        # print("Square:", current_square)
        # print(not_available)
        # print("Available: ", available)

        return available


    def update_available_numbers(self):
        for i in range(len(self.content)):
            self.availables[i] = len(self.get_available_numbers(i)) if self.content[i] == 0 else 0
        # print("Availables: \n", sudoku, "\n")

    def get_min_available_number(self):
        min = 10
        for i in range(len(self.availables)):
            if  self.availables[i] < min and self.content[i] == 0: 
                min = self.availables[i]

        # Si min es 10 es porque no ha encontrado ningún número vacío.
        return min if min != 10 else -1
    
    def get_min_available_position(self):
        min = self.get_min_available_number()

        if min == -1:
            return -1
        
        # Sudoku no completo, busca la posición mínima.
        for i in range(len(self.content)):
            if self.availables[i] == min:
                return i


    def clear(self):
        #Deja el sudoku actual en blanco.
        self.content = [0 for i in range(81)]

    def check_complete(self):
        # Función que comprueba que el sudoku esté totalmente lleno de números.
        for i in self.content:
            if i == 0:
                return False
        return True     


    ''' FUNCIÓN DE CREADO'''
    def create_bruteforce(self): 
        ''' 
        Esta función se encarga de crear un sudoku completo y sin errores.
        
        El algoritmo empleado dentro del bucle while es el mejor que se me ha ocurrido
        hasta ahora, pues funciona aproximadamente el 40% de las veces.

        El bucle while lo utilizo para asegurarme de que el sudoku que he creado esté completo.

        La función NO DEVUELVE NADA, si se quiere ver el sudoku, se deberá usar print(). 
        Ej:
            sudoku1 = Sudoku()
            sudoku1.create()
            print(sudoku1) -> Sudoku completo. 

        '''
        
        complete = False
        while not complete:
            self.clear()
            self.update_available_numbers()
            for i in range(len(self.content)):
                min = self.get_min_available_number()
                # Encontrar la casilla con menor número de posibilidades.
                position = i
                for j in range(len(self.content)):
                    if self.availables[j] == min:
                        position = j
                        break
                
                avl = self.get_available_numbers(position)
                for k in range(len(avl)):
                    number = avl[random.randint(0, len(avl)-1)]
                    self.add(position, number)
                    if self.check_valid_number():
                        break

            complete = self.check_complete()   
        


    def test_uniqueness(self, current) -> bool:
        # Genera la primera solución desde el estado actual
        solution = Sudoku()
        solution.content = current.copy()  # Asegúrate de copiar el estado actual
        solution.create_recursive(clear=False)
        first_solution = solution.content.copy()
        
        # Intenta encontrar una segunda solución diferente, lo hace 10 veces.
        for i in range(10):
            solution_check = Sudoku()
            solution_check.content = current.copy()  
            solution_check.create_recursive(clear=False)
            
            # Si encontramos una solución diferente, no es única
            if solution_check.content != first_solution:
                print(self.debug)
                self.debug += 1
                return False
                
        
        # Si después de 10 intentos todas las soluciones son iguales, es única
        
        return True



    ''' FUNCIÓN DE CREAR PARA JUGAR'''
    def create_playable(self, difficulty: int = 2):
        # Borra el contenido del sudoku. Por defecto, la función lo hace.  
        # Comprobaciones iniciales.
        if difficulty not in [1, 2, 3]:
            raise ValueError(f"Invalid difficulty: {difficulty}. Must be in [1, 2, 3]")
        
        # Difficulty 3 : Deja 24- 28 números.
        # Difficulty 2: Deja 29-33 números.
        # Difficulty 1: Deja 34 - 38 números.
        numbers_to_leave = random.randint(24, 28) if difficulty == 3 else random.randint(29, 33) if difficulty == 2 else random.randint(34, 38)
        
        # n es el número de posiciones que va a borrar.
        n = 81 - numbers_to_leave
        # Se parte de un sudoku lleno.
        self.create_recursive()
        initial = self.content.copy() # Muy importante para que no guarden la misma dirección de memoria.
        self.update_available_numbers()

        # Parte recursiva
        self._create_playable(initial, n)

        return self.content

        
    def _create_playable(self, initial, n: int, positions=None):
        # Si es la primera llamada, inicializa el conjunto de posiciones posibles.
        if positions is None:
            positions = list(range(81))
            random.shuffle(positions)

        # Caso Base
        if n <= 0 or not positions:
            return 

        # CASO RECURSIVO: 
        # Coge una posición de la lista de posiciones.  
        position = positions.pop()

        # Si ya está vacía, pasa a la siguiente recursión
        if self.content[position] == 0:
            self._create_playable(initial, n, positions)
            return

        # Borra el número de la posición escogida.
        self.remove(position)

        # Comprueba que sigue teniendo solución única.
        unique = self.test_uniqueness(current=self.content)

        # Si no tiene solución única, restaura el borrado y no disminuye `n`.
        if not unique:
            self.add(position, initial[position])
        else:
            n -= 1  # Disminuye `n` solo si se borró un número válido.

        # Sigue la recursión.
        self._create_playable(initial, n, positions)


    def create_recursive(self, clear = True):
        if clear:
            self.clear()

        min_pos = self.get_min_available_position()
        
        return self._create_recursive(min_pos)

    def _create_recursive(self, pos):
        if pos == -1 or self.content[pos] != 0:
            return self.content

        available_numbers = self.get_available_numbers(pos)
        random.shuffle(available_numbers)
        for number in available_numbers:
            # Añade el número
            self.add(pos, number)

            # Busca la posición con menos números disponibles
            min_pos = self.get_min_available_position()
            if min_pos == -1 or self.check_complete():
                break
            
            # Llamada recursiva: El sudoku aún no está completo.
            self._create_recursive(min_pos)
            
            # Si después de llamar a la función detecta que está completo, para la recursión.
            if self.check_complete():
                return self.content
            
            # Si no, quita el número que había puesto.
            self.remove(pos)


    def string_to_content(self, str: str):
        # Mostly useless unless you want to create a sudoku from a previous one.
        content = []
        for character in str:
            if character.isnumeric():
                content.append(int(character))
            elif character == "·":
                content.append(0)
        if len(content) != 81:
            raise ValueError(f"Invalid length: {len(content)}.")
        

        self.content = content.copy()

    def get_all_squares(self):
        squares = [[i, j] for i in range(3) for j in range(3)]
        result = []
        for sq in squares:
            full_square = self.get_full_square(sq)
            result.append(full_square)
        return result
    
    def square_format(self):
        #Función que devuelve el contenido del sudoku en forma de matrices de cada cuadrado 3x3.
        squares = self.get_all_squares()
        result = []
        for sq in squares:
           # Convierte la lista sq en una matriz 3x3.
           result.append([sq[i: i+3] for i in range(0, 9, 3)])
        return result


if __name__ == "__main__":
    sudoku = Sudoku()
    sudoku.create_playable(difficulty=1)
    print(f"Playable sudoku: \n\n{sudoku}")

    ''' Descomentar para comprobar que el sudoku es único. '''
    # j = 0
    # sudoku_og = Sudoku()
    # sudoku_og.content = sudoku.content.copy()
    # sudoku_og.create_recursive(clear=False)
    # for i in range(100):  
    #     sudoku2 = Sudoku()
    #     sudoku2.content = sudoku.content.copy()
    #     sudoku2.create_recursive(clear=False)
    #     lista = sudoku2.content.copy()
    #     if lista != sudoku_og.content:
    #         print(sudoku_og.content,"\n\n", lista)
    #         print(f"Falso {j}")
    #         j += 1
    #print(sudoku.square_format())




    