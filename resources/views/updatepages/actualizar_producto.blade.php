<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizar producto</title>
    <script type="module" src="{{ asset('js/updatepages/actualizar_producto.js') }}" defer></script>
</head>
<body>
    
    <form id="formulario">

        <label>Coloque nombre</label>
        <input type="text" id="nombre"><br>

        <label>Coloque descripcion</label>
        <input type="text" id="descripcion"><br>

        <label>Coloque precio</label>
        <input type="number" id="precio"><br>

        <label>Coloque categoria</label>
        <select id="categorias"></select><br>

        <label>Coloque talla</label>
        <select id="tallas"></select><br>

        <label>Coloque cantidad</label>
        <input type="number" id="cantidad"><br>

        <input type="submit" value="Actualizar">

    </form>

    <a href="{{ route('view.inventario') }}"><button>Regresar</button></a>

</body>
</html>
