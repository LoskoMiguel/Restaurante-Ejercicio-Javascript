// Arrays globales para gestionar datos
let platos = [];
let mesas = [];
let ventas_mientras = [];
let ventas = [];

// Referencias al DOM
const nombre_plato = document.getElementById("nombre_plato");
const precio_plato = document.getElementById("precio_plato");
const nombre_mesa = document.getElementById("nombre_mesa");
const capacidad_mesa = document.getElementById("capacidad_mesa");
const selectProductos = document.getElementById("selectProductos");
const selectMesa = document.getElementById("selectMesa");
const cantidad_plato = document.getElementById("cantidad_plato");
const resultado = document.getElementById("resultado");
const detallesMesas = document.getElementById("detallesMesas");

// Función para agregar platos
function agregarPlato() {
  let nombre_plato_value = nombre_plato.value.trim();
  let precio_plato_value = parseInt(precio_plato.value);

  // Validación de datos
  if (!nombre_plato_value) {
    resultado.innerText = "El nombre del plato no puede estar vacío.";
    return;
  }
  if (isNaN(precio_plato_value) || precio_plato_value <= 0) {
    resultado.innerText = "El precio debe ser un número mayor a 0.";
    return;
  }

  // Agregar plato al arreglo
  platos.push({
    nombre: nombre_plato_value,
    precio: precio_plato_value,
  });

  resultado.innerText = "Plato agregado correctamente.";
  cargarProductos();
  console.log("Platos actuales:", platos);
}

// Función para agregar mesas
function agregarMesa() {
  let nombre_mesa_value = nombre_mesa.value.trim();
  let capacidad_mesa_value = parseInt(capacidad_mesa.value);

  // Validación de datos
  if (!nombre_mesa_value) {
    resultado.innerText = "El nombre de la mesa no puede estar vacío.";
    return;
  }
  if (isNaN(capacidad_mesa_value) || capacidad_mesa_value <= 0) {
    resultado.innerText = "La capacidad debe ser un número mayor a 0.";
    return;
  }

  // Agregar mesa al arreglo
  mesas.push({
    nombre: nombre_mesa_value,
    capacidad: capacidad_mesa_value,
  });

  resultado.innerText = "Mesa agregada correctamente.";
  cargarMesas();
  console.log("Mesas actuales:", mesas);
}

// Función para cargar los productos en el select
function cargarProductos() {
  selectProductos.innerHTML = '<option value="">-- Selecciona un Producto --</option>';
  for (let producto of platos) {
    let opcion = document.createElement("option");
    opcion.text = `${producto.nombre} - $${producto.precio}`;
    opcion.value = producto.nombre;
    selectProductos.appendChild(opcion);
  }
}

// Función para cargar las mesas en el select
function cargarMesas() {
  selectMesa.innerHTML = '<option value="">-- Selecciona una Mesa --</option>';
  for (let mesa of mesas) {
    let opcion = document.createElement("option");
    opcion.text = `${mesa.nombre} - Capacidad: ${mesa.capacidad}`;
    opcion.value = mesa.nombre;
    selectMesa.appendChild(opcion);
  }
}

// Función para agregar una venta temporal
function agregarCantidadVenta() {
  let select_producto_value = selectProductos.value;
  let cantidad_plato_value = parseInt(cantidad_plato.value);
  let nombre_mesa_value = selectMesa.value;

  // Validación de datos
  if (!select_producto_value || !nombre_mesa_value) {
    resultado.innerText = "Debes seleccionar un producto y una mesa.";
    return;
  }
  if (isNaN(cantidad_plato_value) || cantidad_plato_value <= 0) {
    resultado.innerText = "La cantidad debe ser un número mayor a 0.";
    return;
  }

  let platoExistente = ventas_mientras.find(
    (venta) =>
      venta.mesa_nombre === nombre_mesa_value &&
      venta.nombre === select_producto_value
  );

  if (platoExistente) {
    platoExistente.cantidad += cantidad_plato_value;
    platoExistente.precio_total = platoExistente.cantidad * platoExistente.precio;
  } else {
    let comida = platos.find((plato) => plato.nombre === select_producto_value);

    if (comida) {
      ventas_mientras.push({
        mesa_nombre: nombre_mesa_value,
        nombre: select_producto_value,
        cantidad: cantidad_plato_value,
        precio: comida.precio,
        precio_total: comida.precio * cantidad_plato_value,
      });
    }
  }

  resultado.innerText = "Plato agregado a la venta temporal.";
  console.log("Ventas temporales:", ventas_mientras);
}

// Función para finalizar y registrar ventas
function agregarVenta() {
  if (ventas_mientras.length === 0) {
    resultado.innerText = "No puedes agregar una venta vacía.";
    return;
  }

  for (let venta of ventas_mientras) {
    let mesaExistente = ventas.find((mesa) => mesa.mesa_nombre === venta.mesa_nombre);

    if (mesaExistente) {
      mesaExistente.nombre_platos.push(venta.nombre);
      mesaExistente.cantidad.push(venta.cantidad);
      mesaExistente.precio_total += venta.precio_total;
    } else {
      ventas.push({
        mesa_nombre: venta.mesa_nombre,
        nombre_platos: [venta.nombre],
        cantidad: [venta.cantidad],
        precio_total: venta.precio_total,
      });
    }
  }

  ventas_mientras = [];
  mostrarVentas();
  resultado.innerText = "Venta registrada correctamente.";
  console.log("Ventas totales:", ventas);
}

// Función para mostrar ventas en el HTML
function mostrarVentas() {
  detallesMesas.innerHTML = "";
  for (let mesa of ventas) {
    let html = `<h3>${mesa.mesa_nombre}</h3><ul>`;
    for (let i = 0; i < mesa.nombre_platos.length; i++) {
      html += `<li>${mesa.nombre_platos[i]}: ${mesa.cantidad[i]}</li>`;
    }
    html += `</ul><p><strong>Total:</strong> $${mesa.precio_total}</p>`;
    detallesMesas.innerHTML += html;
  }
}