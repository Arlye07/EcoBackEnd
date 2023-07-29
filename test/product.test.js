const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const Products = require("../src/models/products.models");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Products Controller Tests", () => {
  // Este bloque de before() se ejecutará antes de los tests.
  before(async () => {
    // Puedes realizar configuraciones adicionales aquí antes de la ejecución de los tests.
  });

  // Este bloque de beforeEach() se ejecutará antes de cada test.
  beforeEach(async () => {
    // Puedes realizar configuraciones adicionales aquí antes de cada test.
  });

  // Este bloque de after() se ejecutará después de los tests.
  after(async () => {
    // Puedes realizar limpiezas adicionales aquí después de la ejecución de los tests.
  });

  // Test para el endpoint GET '/'
  describe("GET /", () => {
    it("Debería retornar un array de productos y un código de estado 200", async () => {
      const res = await chai
        .request(app)
        .get("/")
        .set("Authorization", "Bearer token_de_prueba"); // Reemplaza 'token_de_prueba' con un token de autenticación válido

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      // Asegúrate de verificar otros detalles relevantes de la respuesta según el comportamiento de tu aplicación.
    });
  });

  // Test para el endpoint POST '/'
  describe("POST /", () => {
    it("Debería crear un nuevo producto y retornar un código de estado 200", async () => {
      const productInfo = {
        name: "pizza margarita",
        description: "comida",
        price: 9,
        stock: 99,
        code: "String",
        category: "String",
        status: true,
        img: "https://images.hola.com/imagenes/cocina/recetas/20220208204252/pizza-p…",
      };

      const res = await chai
        .request(app)
        .post("/")
        .set("Authorization", "Bearer token_de_prueba_admin") // Reemplaza 'token_de_prueba_admin' con un token de administrador válido
        .send(productInfo);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message");
      // Asegúrate de verificar otros detalles relevantes de la respuesta según el comportamiento de tu aplicación.
    });
  });

  // Test para el endpoint DELETE '/:productId'
  describe("DELETE /:productId", () => {
    it("Debería eliminar un producto y retornar un código de estado 200", async () => {
      const product = new Products({
        name: "factura",
        description: "comida",
        price: 1,
        stock: 99,
        code: "String",
        category: "String",
        status: true,
        img: "https://images.hola.com/imagenes/cocina/recetas/20220208204252/pizza-p…",
     
        // Asegúrate de proporcionar los detalles necesarios para que coincida con el productId en la URL del endpoint DELETE.
      });
      await product.save();

      const res = await chai
        .request(app)
        .delete(`/${product._id}`)
        .set("Authorization", "Bearer token_de_prueba_admin"); // Reemplaza 'token_de_prueba_admin' con un token de administrador válido

      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.includes(`Product with ID ${product._id} has been deleted`);
      // Asegúrate de verificar otros detalles relevantes de la respuesta según el comportamiento de tu aplicación.
    });
  });
});
