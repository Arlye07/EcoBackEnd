const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing AdoptMe", () => {
  describe("Test de mascotas", () => {
    it("El endpoint debe crear correctamente", async () => {
      const petMock = {
        name: "pancho",
        specie: "cat",
        birtday: "10-19-2022",
      };
      const { _body, statusCode } = (await requester.post("api/pets")).send(
        petMock
      );

      expect(_body.payload.to.have.property("_id"));
      expect(statusCode).to.equal(201);
    });
  });
});
