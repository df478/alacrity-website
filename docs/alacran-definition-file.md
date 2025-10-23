---
id: alacran-definition-file
title: Alacran Definition File
sidebar_label: Alacran Definition File
---

<br/>
## Basics
One of the key components of AlaCrity is the `alacran-definition` file that sits at the root of your project. In case of NodeJS app, it sits next to package.json, or next to index.php in case of PHP, or requirements.txt for Python app. It's a simple JSON like this:


```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

`schemaVersion` is always 2. And `templateId` is the piece which defines the foundation you need in order to run your app. It is in `LANGUAGE/VERSION` format. LANGUAGE can be one of these: `node`, `php`, `python-django`, `ruby-rack`. And VERSION is the version of the language you want to use.

Note that although the `templateId` can be one of the 4 most popular web app languages: NodeJS, PHP and Python/Django, Ruby/Rack, you are NOT LIMITED to these predefined languages! With AlaCrity, you have the ability to define your own Dockerfile. With a customized Dockerfile, you can deploy any laguage, Go, Java, .NET, you name it! Dockerfiles are quite easy to write. For example, the two alacran-definition files below generate <b>the exact same result</b>.

#### Simple version

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```


#### Advanced Version

```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:8.7.0-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "WORKDIR /usr/src/app",
                        "COPY ./package.json /usr/src/app/",
                        "RUN npm install && npm cache clean --force",
                        "COPY ./ /usr/src/app",
                        "ENV NODE_ENV production",
                        "ENV PORT 80",
                        "EXPOSE 80",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
## Use Dockerfile in alacran-definition:

Note that the simple version of `alacran-definition` with `templateId` is good as a starting point. But as your project gets more complex you may want to perform more complicated tasks with your base image, such as installing PHP extensions, installing `uWSGI`, installing particular version of `curl` and etc. In these cases, you can leverage the Dockerfile. Using custom Dockerfile allows you to build a very customized base image. If you're not familiar with Docker, you can simply use google to find something that's similar to your requirement and tweak it. Finally, if you're stuck, don't be shy to ask a question on our Slack channel, or StackOverflow.


To use a Dockerfile that's in your repository, you can simply reference it in the alacran-definition file:

```
 {
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
 }
```

Dockerfiles are so simple and easy to read. Even if you don't know anything about Docker, you can get an idea what this does.

Using this approach (pure Dockerfile) you can deploy Ruby, Java, Scala, literally anything! If you need more details on dockerfile, please see [Dockerfile Help](https://docs.docker.com/engine/reference/builder) and [Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices).

## Use Image Name

If you are an advanced Docker user, you may know that there are plenty of pre-built applications sitting on DockerHub. You can deploy these images using alacran-definition. For example to deploy https://hub.docker.com/r/nginxdemos/hello/, you use: 

```
 {
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
 }
```

Tip: You can simply copy and paste the alacran-definition file above on AlaCrity web dashboard under the deploy tab.


## Monorepo:
You can use one git repo to deploy multiple different apps. For example, you may have a frontend and backend app in one repository. In this case, you can define multiple `alacran-definition` files and have them deploying separate apps, for example, a directory structure, like this:
```
/project
   /frontend
      /src/index.js
      package.json
   /backend
      /src/index.js
      package.json
alacran-definition-backend
alacran-definition-frontend
```
With this content:
`alacran-definition-backend`
```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:12-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "COPY ./backend /usr/src/app",
                        "RUN npm install && npm cache clean --force",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
You can alternatively point to a Dockerfile. Note that the build context will be always the root of your project, so in the Dockerfile, you'll have to point to that specific directory, for example, `COPY ./backend /usr/src/app`

Next, you need to instruct your AlaCrity to use the correct `alacran-definition` for each app. Navigate to your app, go to DEPLOYMENT tab, and edit your alacran-definition path to `./alacran-definition-backend`
