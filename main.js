/*Kauã Silva, Arthur, renan, nicole*/
window.onload = ()=>{

  const popup = document.querySelector(".pop")
  let a = document.createElement("a")
  var span = document.createElement("span")
  span.innerHTML = "&times";
  span.setAttribute("class", "icon")
  a.append(span)
  a.setAttribute("href", "#")
  a.setAttribute("text-decoration", "none")
  a.addEventListener("click", () => {
    popup.style.display = "none"
    popup.innerText = ""
  })
  const body = document.querySelector("main")
  const results = document.querySelector(".results")

  function CreateSerie(data){
  let DIV = document.createElement("div")

    //Add name title
    let title = document.createElement("h2")
    title.innerText = data.show.name
    DIV.append(title)

    //Add image
    let IMG = document.createElement("img")
    try{
      IMG.setAttribute("src", data.show.image.medium)
    }
    catch(e){
      IMG.setAttribute("src", "https://demofree.sirv.com/nope-not-here.jpg")
    }
    DIV.append(IMG)

    //Add descripition
    let P_text = document.createElement("p")
    P_text.innerHTML = data.show.summary
    DIV.append(P_text)

    DIV.addEventListener("click", () => {
      let id = data.show.id

        $.ajax({
          url: "https://api.tvmaze.com/shows/"+id+"/episodes",
          type: "get",
          success: (data) => {
            let div = document.createElement("div")
            popup.innerHTML = ""
            popup.append(a)
            $.ajax({
              url: "https://api.tvmaze.com/shows/"+id+"/cast",
              type: "get",
              success: (person) => {

                let title = document.createElement("h3")
                title.innerText = "Elenco: "
                div.append(title)

                let listaAtores = document.createElement("p")
                listaAtores.classList.add("atores")

                for (var k in person) {
                  let id = person[k].person.id
                  let link = document.createElement("a")
                  link.setAttribute("href",  "#")
                  link.addEventListener("click", () => {
                    $.ajax({
                      url: `https://api.tvmaze.com/people/${id}/castcredits?embed=show`,
                      type: "get",
                      success: (data) => {
                        popup.style.display = "none"
                        body.innerHTML = ""
                        $.ajax({
                          url: `https://api.tvmaze.com/people/${id}`,
                          type: "get",
                          success: (pessoa) => {
                            document.querySelector("input").value = ""
                            results.innerText = `Séries com ${pessoa.name}:`
                          }
                        })
                        for (item in data){
                          CreateSerie(data[item]._embedded)
                        }
                      }
                    })
                  })
                  let ator = document.createElement("p")
                  ator.innerHTML = person[k].person.name
                  link.append(ator)
                  listaAtores.append(link)
                }
               div.append(listaAtores)
              }
            })


            for (var i in data) {

              let temporada = document.createElement("h1")
              temporada.innerHTML ="Temp "+ data[i].season

              div.append(temporada)

              let epNum = document.createElement("h3")
              epNum.innerText = "Ep "+data[i].number
              div.append(epNum)


              let epNome = document.createElement("h3")
              epNome.innerText = data[i].name
              div.append(epNome)

              let imagem = document.createElement("img")
              try{
                imagem.setAttribute("src", data[i].image.medium)
              }
              catch(e){
                imagem.setAttribute("src", "https://demofree.sirv.com/nope-not-here.jpg")
              }
              div.append(imagem)

              let espaço = document.createElement("br")
              div.append(espaço)
              let descricao = document.createElement("h4")
              descricao.innerHTML = data[i].summary
              div.append(descricao)


              let dataep = document.createElement("p")
              dataep.innerText = "Postado em: " + data[i].airdate + " as " + data[i].airtime
              div.append(dataep)

              let url = document.createElement("a")
              url.innerText = "ASSISTIR"
              url.setAttribute("href",data[i].url)
              div.append(url)

              div.append(document.createElement("hr"))
            }
            popup.append(div)
          }
        })
        popup.style.display = "inline-block";
    })


    //Add these to body
    let linked = document.createElement("a")
    linked.setAttribute("href", "#look")
    linked.append(DIV)
    body.append(linked)
  }
  function getMovies(name){
    if(name > 0){
      $.ajax({
        url: `https://api.tvmaze.com/people/${name}/castcredits?embed=show`,
        type: "get",
        success: (data) => {
          $.ajax({
            url: `https://api.tvmaze.com/people/${name}`,
            type: "get",
            success: (pessoa) => {
              results.innerText = `Séries com ${pessoa.name}:`
              body.innerHTML = ""
              for(let i = 0; i < data.length; i++){
                CreateSerie(data[i]._embedded)
              }
            }
          })
        }
      })
    }
    else{
      body.innerHTML = ""
      $.ajax({
        url: `https://api.tvmaze.com/search/shows?q=${name}`,
        type: "get",
        success: (data)=>{
          results.innerText = `Resultados para ${name}: `
          for(let i = 0; i < data.length; i++){
            CreateSerie(data[i])
          }
        },
      })
    }
  }

  const form = document.querySelector("form")
  form.addEventListener("submit", (e)=>{
    e.preventDefault()
  })

  const input = document.querySelector("input")
  input.addEventListener("keyup", ()=>{
    getMovies(input.value)
  })
}
