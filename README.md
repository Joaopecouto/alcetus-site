<p align="center"><img src="https://raw.githubusercontent.com/Joaopecouto/Joaopecouto/main/assets/projects/v3/alcetus.png" width="96" alt="Ícone do projeto"></p>

<h1 align="center">Alcetus</h1>

<p align="center">Site institucional e identidade da marca Alcetus.<br><sub><i>Alcetus brand website.</i></sub></p>

<p align="center">
  <kbd><img src="https://raw.githubusercontent.com/Joaopecouto/Joaopecouto/main/assets/icons/v2/html5.svg" height="18" align="absmiddle" alt=""> HTML5</kbd> <kbd><img src="https://raw.githubusercontent.com/Joaopecouto/Joaopecouto/main/assets/icons/v2/css.svg" height="18" align="absmiddle" alt=""> CSS</kbd> <kbd><img src="https://raw.githubusercontent.com/Joaopecouto/Joaopecouto/main/assets/icons/v2/javascript.svg" height="18" align="absmiddle" alt=""> JavaScript</kbd> <kbd><img src="https://raw.githubusercontent.com/Joaopecouto/Joaopecouto/main/assets/icons/v2/docker.svg" height="18" align="absmiddle" alt=""> Docker</kbd>
</p>

Site: [alcetus.com](https://alcetus.com)

## Português

Site estático (HTML, CSS e JavaScript puro) da marca Alcetus, containerizado com Docker para deploy.

### Como rodar

```bash
# Localmente: abra o index.html no navegador.
# Com Docker (porta conforme o Dockerfile):
docker build -t alcetus-site .
docker run -p 8080:80 alcetus-site
```

## English

Static website (vanilla HTML, CSS and JavaScript) for the Alcetus brand, containerized with Docker for deployment.

### Getting started

```bash
# Locally: open index.html in your browser.
# With Docker (port as defined in the Dockerfile):
docker build -t alcetus-site .
docker run -p 8080:80 alcetus-site
```

<sub>Contato · Contact: <a href="https://joaocouto.alcetus.com">joaocouto.alcetus.com</a> · <a href="mailto:joaopecouto77@gmail.com">joaopecouto77@gmail.com</a></sub>
