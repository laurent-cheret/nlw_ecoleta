//node pack manager NPM//
//npm init -y//
//npm install express ( criou uma várias pastas de dependencias do express)//


const express = require("express")
const server = express()
//pegar o banco de dados db
const db = require("./database/db.js")

server.use(express.static("public"))

//habilitar o uso do req.body na aplicação

server.use(express.urlencoded({ extended: true}))

const nunjucks = require("nunjucks")

nunjucks.configure("src/views", {
    express: server,
    noCache: true
} )

// req é uma requisição e res é um resposta
server.get("/", (req,res) =>{
    return res.render ("index.html",{title: "Um título"})
})

server.get("/create-point", (req,res) =>{

   // console.log (req.query)

    return res.render ("create-point.html")
})

server.post("/savepoint", (req,res) => {



    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (
            ?,?,?,?,?,?,?);
    `

    const values = 
        [req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items]

    function afterInsertData(err) { 
            if(err) {
            console.log(err)
            return res.send("Erro no Cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }
        
    db.run(query, values, afterInsertData)



    console.log(req.body)
    
})

server.get("/search", (req,res) =>{

    const search = req.query.search

    if (search == "") {
        return res.render ("search-results.html", {total: 0})

        //pesquisa vazia
    }

    //pegar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
    
        }

        const total = rows.length
        return res.render ("search-results.html", { places: rows, total:total})
    })

})

server.listen(3000)

