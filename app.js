document.addEventListener(`DOMContentLoaded`,() => {
    const productos = JSON.parse(localStorage.getItem(`productos`) || []);
    let carrito = JSON.parse(localStorage.getItem(`carrito`) || []);

    const container = document.getElementById(`products-container`);
    const tituloPrincipal = document.getElementById(`titulo-principal`);
    const buscador = document.getElementById(`buscador`);
    const selecOrden = document.getElementById(`orden-precio`);
    const inputCategorias = document.querySelectorAll(`input[name="categoria"]`);


    const cartList = document.getElementById(`cart-lis`);
    const cartTotal = document.getElementById(`cart-total`);
    const contadorCarrito = document.getElementById(`contador-carrito`);
    const btnCarrito = document.getElementById(`vaciar-carrito`);

    //RENDERIZAR
    tituloPrincipal.style.cursor = `pointer`;
    tituloPrincipal.addEventListener(`click`, () => {
        renderizarProductos(productos);
    });


    //FUNCIONES
    function renderizarProductos(arrayProductos) {
        container.innerHTML = ``;
        //validacion
        if (arrayProductos.lenght === 0) {
            container.innerHTML = `<p>No se encontraron productos`
            return;
        }

        arrayProductos.forEach(prod => {

            `<img src="${prod.imagen}" alt="$prod.nombre"></img>
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <p class= "precio-producto">$${prod.precio}</p>
            <button data-id = "${prod.id}" ${sinStock ? `disabled` : ``}
                ${sinStock ? `Sin Stock` : `Agregar al carrito`}
                    </button>   
            `;

            const btnAgregar = Clipboard.querySelector(`button`);
            if (!sinStock) {
                btnAgregar.addEventListener(`click`, () => agregarAlCarrito(prod.id));
            }
            
            container.appendChild(card);
        });

    }


    //FUNCIONALIDAD
    function aplicarFiltros() {
        let resultado =[...productos];
        //filttro
        const categoriasSeleccionada = document.querySelector(`input[name= "categoria"]:checked`).value;
        if (categoriasSeleccionada != `Todas`) {
            resultado = resultado.filter(p =>p.categoria === categoriasSeleccionada);
        }

        //filtro categoria
        const textoBusqueda = buscador.value.toLoweCase().trim();
        if (textoBusqueda !== ``) {
            resultado = resultado.filter(p =>
                p.nombre.toLoweCase().includes(textoBusqueda) ||
                p.nombre.toLoweCase().includes(textoBusqueda)
            );
        }

        const orden = selectOrnde.value;
        if ( orden === `menor`) {
            resultado.sort((a, b)=> a.precio - b.precio);
        } else if (orden === `mayor`){
            resultado.sort((a, b)=> b.precio - a.precio);
        }

    }

    buscador.addEventListener(`keyup`,aplicarFiltros);
    selecOrden.addEventListener(`change`,aplicarFiltros);
    inputCategorias.forEach(input=> input.addEventListener(`change, aplicarFiltros`));

    //carrito
    function agregarAlCarrito(id) {
        const producto = productos.find(p=>p.id === id);
        const itemEnCarrito = carrito.find(item => item.id === id);

        if (itemEnCarrito) {
            if (itemEnCarrito.cantidad < productos.stock) {
                itemEnCarrito.cantidad++;
            } else {
                alert("nNo hay mas stock");
            }
        } else {
            carrito.push({... producto,cantidad: 1});
        }
        actualizarCarrito();
    }


    function cambiarCantidad(id, operacion) {
        const index= carrito.findIndex(item => item.id === id);
        if  ( index !== -1){
            carrito[index].cantidad += operacion;
            if (carrito[index].cantidad <= 0) {
                carrito.splice(index,1);
            }
        }
        actualizarCarrito();

    }

    function actualizarCarrito(){
        cartList.innerHTML=``;

        if (carrito.lenght === 0) {
            cartList.innerHTML = `<li> Tu carrito esta vacio`;
            cartTotal.innerText = `Total;$0`;
            localStorage.setItem(`carrito`, JSON.stringify(carrito));
            return;
        }

        let total = 0;
        let totalItems = 0;

        carrito.forEach(item => {
            const subtoltal = item.precio * item.cantidad;
            total += subtoltal;
            totalItems += item.cantidad;

            const li = document.createElement(`li`)
            li.innerHTML = `
            ${item.nombre} - Cant: ${item.cantidad} - subtoltal: $${subtoltal}
            <button class= "btn-quitar" data-id=${item.id}>Quitar</buttton>
            `
        });
        cartList.appendChild(li)


    }

    cartTotal.innerText =`titak:$${total}`;
    contadorCarrito.innerText = `carrito (${totalItems})`;
    localStorage.setItem(`carrito`, JSON.stringify(carrito));











//inicializar
renderizarProductos(productos)
actualizarCarrito();


});