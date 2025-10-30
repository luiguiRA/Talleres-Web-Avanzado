import { Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  costo: number;
  precio: number;
  valor: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  cargando = false;
  editando = false;
  private nextId = 1;
  displayedColumns: string[] = ['id', 'codigo', 'nombre', 'precio', 'valor', 'acciones'];

  nuevo: Partial<Producto> = {
    codigo: '',
    nombre: '',
    costo: 0,
    precio: 0,
    valor: 0
  };
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  log: string= '';
  cargarProductos() {
    this.cargando = true;

    setTimeout(() => {
      this.productos = [
        { id: this.nextId++, codigo: 'PI-001',nombre: 'Producto A', costo: 50, precio: 80, valor: 30 }
      ];
      this.cargando = false;
    }, 300);
  }


  guardar() {
    if (!this.validarFormulario()) {
        return;
    }

    try {
        const costoNum = Number(this.nuevo.costo);
        const precioNum = Number(this.nuevo.precio);
        const valorNum = precioNum - costoNum;

        if (this.editando && this.nuevo.id != null) {
            if (this.actualizarProducto(costoNum, precioNum, valorNum)) {
                this.mostrarMensaje('Producto actualizado correctamente');
                this.resetForm();
            }
        } else {
            if (this.agregarProducto(costoNum, precioNum, valorNum)) {
                this.mostrarMensaje('Producto agregado correctamente');
                this.resetForm();
            }
        }
    } catch (error) {
        this.mostrarMensaje('Error al procesar el producto', true);
        console.error('Error:', error);
    }
  }

  private validarFormulario(): boolean {
    if (!this.nuevo.codigo || !/^[A-Za-z]\d+$/.test(this.nuevo.codigo)) {
      this.mostrarMensaje('Código de producto debe iniciar con una letra seguida de números. Ejemplo: A001', true);
      return false;
    }

    if (!this.nuevo.nombre || this.nuevo.nombre.length < 5) {
      this.mostrarMensaje('El nombre del producto debe tener mínimo 5 caracteres.', true);
      return false;
    }

    const costoNum = Number(this.nuevo.costo);
    if (costoNum <= 0) {
      this.mostrarMensaje('Ingrese un costo válido.', true);
      return false;
    }

    const precioNum = Number(this.nuevo.precio);
    if (precioNum < 10 || precioNum > 100) {
      this.mostrarMensaje('El precio está fuera de rango.', true);
      return false;
    }

    return true;
  }

  // ...existing code...
  private actualizarProducto(costoNum: number, precioNum: number, valorNum: number): boolean {
    const idx = this.productos.findIndex(p => p.id === this.nuevo.id);
    if (idx > -1) {
      this.productos[idx] = {
        id: this.nuevo.id!,
        codigo: String(this.nuevo.codigo),
        nombre: String(this.nuevo.nombre),
        costo: Math.round(costoNum),
        precio: Number(precioNum),
        valor: Number(valorNum)
      };
      return true;
    }
    return false;
  }

  private agregarProducto(costoNum: number, precioNum: number, valorNum: number): boolean {
  
    if (isNaN(costoNum) || isNaN(precioNum) || isNaN(valorNum)) {
        this.mostrarMensaje('Error: valores inválidos', true);
        return false;
    }

    const nuevoProd: Producto = {
        id: this.nextId++,
        codigo: String(this.nuevo.codigo).trim(),
        nombre: String(this.nuevo.nombre).trim(),
        costo: Math.round(costoNum),
        precio: Number(precioNum),
        valor: Number(valorNum)
    };
    
    if (nuevoProd.codigo && nuevoProd.nombre) {
        this.productos.push(nuevoProd);
        return true;
    } else {
        this.mostrarMensaje('Error al crear el producto', true);
        return false;
    }
  }
// ...existing code...

  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    this.log = esError ? mensaje : ''; // Actualizar el log para errores
    this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
        panelClass: esError ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  editar(p: Producto) {
    this.editando = true;
    this.nuevo = { ...p };
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.id !== id);
      if (this.editando && this.nuevo.id === id) {
        this.cancelar();
      }
      this.mostrarMensaje('Producto eliminado correctamente');
    }
  }

  cancelar() {
    this.resetForm();
  }

  private logProducto(producto: Producto) {
    console.log('Producto a agregar:', {
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        costo: producto.costo,
        precio: producto.precio,
        valor: producto.valor
    });
}
  private resetForm() {
    this.editando = false;
    this.nuevo = {
      codigo: '',
      nombre: '',
      costo: 0,
      precio: 0,
      valor: 0
    };
  }
}