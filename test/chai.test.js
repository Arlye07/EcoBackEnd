const mongoose = require('mongoose')
const Users = require('../src/dao/users.dao.js')
const chai =require('chai')

mongoose.connect(
    `mongodb+srv://admin:admin@ecommerce.ndni8ke.mongodb.net/ecommerce?retryWrites=true&w=majority`
//`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
)

const expect = chai.expect

describe('Testeando DAO con CHAI',() =>{
    const mockUser = {
        first_name: 'Ariel',
        last_name:'Villagra',
        email_:'arielvillagra7@gmail.com',
        password:'Hispano07'
    }

    before(function() {
        this.Users = new Users()
    })
    beforeEach(async function(){
        this.timeout(5000)
        await mongoose.connection.collections.users.deleteMany({})
    })
    it('El dao debe obtener los usuarios en forma de arreglo', async function (){
        const result=await this.Users.get()
        //assert.strictEqual(Array.isArray(result),true)
        expect(result).to.be.deep.equal([])
    })
    xit('El Dao debe agregar correctamente un elemento a la base de datos.',async function(){
        const result = await this.Users.save(mockUser)
       // assert.ok(result._id)
        expect(result).to.have.property('_id')
    })
    xit('Al agregar un nuevo usuario,este debe agregarse.',async function(){
        const result = await this.Users.save(mockUser)
        assert.deepStrictEqual(result.Users, [])
        expect(result).to.have.property('Users')
    })
    xit('El dao puede obtener un usuario por email.',async function(){
        const result = await this.Users.save(mockUser)
        const user = await this.Users.getBy({email:result.email})
        //console.log(user);
        //assert.strictEqual(typeof user, 'object')
        expect(result).to.have.property('email')

    })
    xit('El dao puede actualizar el nombre del usuario', async function(){
        const user = await this.Users.save(mockUser)
        await this.Users.update(user._id, {first_name: 'ari'})
        const result = await this.Users.getBy({_id: user.id})
        expect(result.first_name).to.equal('ari')
    })
    xit('El dao debe poder eliminar un usuario', async function(){
        const user = await this.Users.save(mockUser)
        await this.Users.delete(user._id)
        const result = await this.Users.getBy({_id: user.id})
        expect(result).is.null
    })
})


