import cv2
import numpy as np
import tkinter as tk
from tkinter import Label, Button, Frame, Entry
from PIL import Image, ImageTk

# Configuración de la ventana de tkinter
root = tk.Tk()
root.title("Selección de Tablero de Ajedrez en Tiempo Real")

# Inicializar la cámara
cap = cv2.VideoCapture(1)  # 0 es el índice de la cámara por defecto

# Variables globales
points = []  # Puntos para la transformación del tablero
selected_point_index = None  # Índice del punto seleccionado para modificar
corners = np.float32([[0, 0], [480, 0], [480, 480], [0, 480]])
selected_frame = None
warp_perspective_ready = False
cell_points = []  # Puntos para las esquinas de las casillas
cell_grid = None  # Cuadrícula generada de las celdas

# Frame principal para la organización de los widgets
main_frame = Frame(root)
main_frame.pack()

# Frame para la cámara (izquierda)
camera_frame = Frame(main_frame)
camera_frame.pack(side="left")

# Canvas para mostrar el feed de la cámara
canvas = tk.Canvas(camera_frame, width=640, height=480)
canvas.pack()

# Frame para selección de esquinas de casillas (derecha)
selection_frame = Frame(main_frame)
selection_frame.pack(side="right", padx=20)

# Canvas para mostrar la imagen transformada
transformed_canvas = tk.Canvas(selection_frame, width=480, height=480)
transformed_canvas.pack()

# Labels para mostrar los puntos seleccionados
point_labels = [Label(camera_frame, text="Punto 1: --, --"),
                Label(camera_frame, text="Punto 2: --, --"),
                Label(camera_frame, text="Punto 3: --, --"),
                Label(camera_frame, text="Punto 4: --, --")]

for label in point_labels:
    label.pack()

# Label para mostrar los puntos de las casillas
cell_labels = [Label(selection_frame, text="Casilla 1: --, --"),
               Label(selection_frame, text="Casilla 2: --, --"),
               Label(selection_frame, text="Casilla 3: --, --"),
               Label(selection_frame, text="Casilla 4: --, --")]

for label in cell_labels:
    label.pack()

# Entrada para seleccionar una celda
cell_entry = Entry(selection_frame, width=10)
cell_entry.pack(pady=5)

# Detecciones simuladas
detections = [
    [30, 120, 80, 170, 0.9, "Torre"],      # Esquina superior izquierda, más abajo
    [200, 170, 250, 220, 0.85, "Peon"],   # Parte superior central, más abajo
    [400, 170, 450, 220, 0.95, "Caballo"],# Esquina superior derecha, más abajo
    [50, 220, 100, 270, 0.78, "Reina"],   # Parte central izquierda
    [220, 270, 270, 320, 0.88, "Rey"],    # Centro del tablero
    [400, 250, 450, 300, 0.82, "Peon"],   # Parte central derecha
    [50, 400, 100, 450, 0.91, "Alfil"],   # Esquina inferior izquierda
    [250, 400, 300, 450, 0.86, "Peon"],   # Parte inferior central
    [400, 400, 450, 450, 0.89, "Torre"]   # Esquina inferior derecha
]



# Actualizar las etiquetas de los puntos
def update_point_labels():
    for i, label in enumerate(point_labels):
        if i < len(points):
            x, y = points[i]
            label.config(text=f"Punto {i+1}: {x}, {y}")
        else:
            label.config(text=f"Punto {i+1}: --, --")

def update_cell_labels():
    for i, label in enumerate(cell_labels):
        if i < len(cell_points):
            x, y = cell_points[i]
            label.config(text=f"Casilla {i+1}: {x}, {y}")
        else:
            label.config(text=f"Casilla {i+1}: --, --")

# Resetear puntos y celdas
def reset_points():
    global points, warp_perspective_ready, selected_point_index
    points.clear()
    selected_point_index = None
    warp_perspective_ready = False
    update_point_labels()

def reset_cell_points():
    global cell_points, cell_grid
    cell_points.clear()
    cell_grid = None
    transformed_canvas.delete("all")
    update_cell_labels()
    if selected_frame is not None:
        show_transformed_image(selected_frame)

# Dibujar la celda seleccionada
def highlight_cell():
    global cell_grid, selected_frame
    if cell_grid is not None and selected_frame is not None:
        cell = cell_entry.get().strip().lower()
        try:
            row_idx, col_idx = get_cell_indices(cell)
            top_left, bottom_right = cell_grid[row_idx][col_idx]
            image_copy = selected_frame.copy()
            cv2.rectangle(image_copy, tuple(top_left.astype(int)), tuple(bottom_right.astype(int)), (0, 0, 255), 2)
            show_transformed_image(image_copy)
        except Exception as e:
            print(f"Error al seleccionar la celda: {e}")

def show_transformed_image(image):
    """Mostrar la imagen transformada en el canvas derecho."""
    dst_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(dst_rgb)
    imgtk = ImageTk.PhotoImage(image=img)
    transformed_canvas.imgtk = imgtk
    transformed_canvas.create_image(0, 0, anchor=tk.NW, image=imgtk)

# Calcular la cuadrícula de celdas
def calculate_cell_grid():
    global cell_points
    top_edge = np.linspace(cell_points[0], cell_points[1], 9)
    bottom_edge = np.linspace(cell_points[3], cell_points[2], 9)
    grid = []
    for i in range(8):
        row = []
        for j in range(8):
            top_left = np.linspace(top_edge[j], bottom_edge[j], 9)[i]
            bottom_right = np.linspace(top_edge[j + 1], bottom_edge[j + 1], 9)[i + 1]
            row.append((top_left, bottom_right))
        grid.append(row)
    return grid

# Obtener índices de una celda
def get_cell_indices(cell):
    col, row = cell[0], cell[1]
    col_idx = ord(col) - ord('a')
    row_idx = 8 - int(row)
    return row_idx, col_idx

# Eventos de clic y procesamiento de video
def capture_point(event):
    global points, warp_perspective_ready
    x, y = event.x, event.y
    if len(points) < 4:
        points.append((x, y))
        update_point_labels()
    if len(points) == 4:
        warp_perspective_ready = True

def capture_cell_point(event):
    global cell_points, cell_grid
    x, y = event.x, event.y
    if len(cell_points) < 4:
        cell_points.append((x, y))
        update_cell_labels()
    if len(cell_points) == 4:
        cell_grid = calculate_cell_grid()

# Función para dibujar todas las celdas en verde
def draw_all_cells(image, grid):
    """Dibujar todas las celdas de la cuadrícula en verde."""
    for row in grid:
        for top_left, bottom_right in row:
            cv2.rectangle(image, tuple(top_left.astype(int)), tuple(bottom_right.astype(int)), (0, 255, 0), 2)

# Función para resaltar una celda específica en rojo
def draw_single_cell(image, cell, grid):
    """Resaltar una celda específica en rojo."""
    try:
        row_idx, col_idx = get_cell_indices(cell)
        top_left, bottom_right = grid[row_idx][col_idx]
        cv2.rectangle(image, tuple(top_left.astype(int)), tuple(bottom_right.astype(int)), (0, 0, 255), 2)
    except Exception as e:
        print(f"Error al resaltar la celda: {e}")
# Función para dibujar los puntos seleccionados y sus etiquetas
def draw_points_on_frame(frame):
    """Dibujar puntos seleccionados y sus etiquetas en el feed."""
    for i, (x, y) in enumerate(points):
        cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)  # Punto verde
        # cv2.putText(frame, f"P{i+1}", (x + 10, y - 10), 
        #             cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2, cv2.LINE_AA)

# Modificar `process_frame` para dibujar los puntos en el feed principal
# Función para dibujar las detecciones simuladas en el frame transformado
# Función para calcular el centro de un bounding box
def get_bottom_midpoint(bbox):
    """Obtener el punto medio inferior de un bounding box."""
    x_min, y_min, x_max, y_max = bbox[:4]
    return ((x_min + x_max) // 2, (y_max+ y_min)//2 +5)

# Función para determinar la celda en la que se encuentra un punto
def get_cell_from_point(point, grid):
    """Determinar en qué celda está un punto dado la cuadrícula."""
    for row_idx, row in enumerate(grid):
        for col_idx, (top_left, bottom_right) in enumerate(row):
            if (top_left[0] <= point[0] <= bottom_right[0] and
                top_left[1] <= point[1] <= bottom_right[1]):
                col = chr(ord('a') + col_idx)  # Convertir columna a letra
                row = 8 - row_idx              # Convertir fila a número
                return f"{col}{row}"
    return None

# Modificar `draw_detections_on_frame` para incluir la celda
def draw_detections_on_frame(frame, detections, grid):
    """Dibujar bounding boxes, etiquetas y posiciones de detecciones."""
    for detection in detections:
        x_min, y_min, x_max, y_max, confidence, class_name = detection

        # Dibujar el bounding box
        cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (255, 0, 0), 2)

        # Calcular el centro del bounding box
        bottom_midpoint = get_bottom_midpoint(detection)

        # Determinar la celda del tablero
        cell = get_cell_from_point(bottom_midpoint, grid) if grid is not None else "N/A"

        # Crear la etiqueta con clase, confiabilidad y posición
        label = f"{class_name} en {cell}" #({confidence:.2f})
        cv2.putText(frame, label, (x_min, y_min - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2, cv2.LINE_AA)

# Modificar `process_frame` para calcular y mostrar las posiciones de las piezas
def process_frame():
    global selected_frame, warp_perspective_ready, cell_grid
    ret, frame = cap.read()
    if not ret:
        return

    # Dibujar los puntos seleccionados en el frame
    draw_points_on_frame(frame)

    # Convertir el frame a formato RGB para Tkinter
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame_rgb)
    imgtk = ImageTk.PhotoImage(image=img)

    # Mostrar el frame en el Canvas principal
    canvas.imgtk = imgtk
    canvas.create_image(0, 0, anchor=tk.NW, image=imgtk)

    # Aplicar transformación de perspectiva en tiempo real
    if len(points) == 4:
        points_np = np.float32(points)
        M = cv2.getPerspectiveTransform(points_np, corners)
        dst = cv2.warpPerspective(frame, M, (480, 480))
        selected_frame = dst

        # Dibujar todas las celdas en verde si la cuadrícula está definida
        if cell_grid is not None:
            draw_all_cells(dst, cell_grid)

        # Dibujar las detecciones simuladas en el frame transformado
        draw_detections_on_frame(dst, detections, cell_grid)

        # Dibujar una celda específica en rojo si se ingresó en el campo de texto
        cell = cell_entry.get().strip().lower()
        if cell and cell_grid is not None:
            draw_single_cell(dst, cell, cell_grid)

        # Mostrar la imagen transformada actualizada en tiempo real
        show_transformed_image(dst)

    root.after(10, process_frame)

# Modificar `capture_cell_point` para recalcular la cuadrícula y actualizar las celdas
def capture_cell_point(event):
    global cell_points, cell_grid
    x, y = event.x, event.y
    if len(cell_points) < 4:
        cell_points.append((x, y))
        update_cell_labels()
    if len(cell_points) == 4:
        cell_grid = calculate_cell_grid()


# Asignar eventos y botones
canvas.bind("<Button-1>", capture_point)
transformed_canvas.bind("<Button-1>", capture_cell_point)
# Button(selection_frame, text="Resaltar Celda", command=highlight_cell).pack()
Button(camera_frame, text="Reiniciar Puntos", command=reset_points).pack()
Button(selection_frame, text="Reiniciar Casillas", command=reset_cell_points).pack()
Button(root, text="Salir", command=root.destroy).pack()

# Iniciar video y Tkinter
process_frame()
root.mainloop()

cap.release()
cv2.destroyAllWindows()
