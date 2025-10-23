---
id: pre-deploy-script
title: Pre-deploy Script
sidebar_label: Pre-deploy Script
---

<br/>
This is a very advanced operation and requires attention. Otherwise, it can break the deployment for your app. 

This script will run right before your container (i.e. app) gets updated due to a configuration change or app deploy. In this script, you can modify the Docker service object, invoke an HTTP call, and literally do anything. The template for this script is:
```
var preDeployFunction = function (alacranAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    // Do something in a Promise form

		    // In the end, return the "possibly-modified" dockerUpdateObject
		    return dockerUpdateObject;
		});
};

```

Note that `alacranAppObj`, is the app object as saved in `/alacran/data/config-alacran.json` file, and `dockerUpdateObject` is the service update object that is being passed to Docker to update the service (environment vars, image version and etc). This object is as per [Docker docs](https://docs.docker.com/engine/api/v1.30/#operation/ServiceUpdate).

Since this script will be executed in AlaCrity process, you'll get access to all node dependecies that AlaCrity has. For example, the following script injects a UUID mapped to the deployed version to service label with every update:

```
var { v4: uuid } = require('uuid');

var preDeployFunction = function (alacranAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] =
                                                         alacranAppObj.deployedVersion+ '';
		    return dockerUpdateObject;
		});
};

```

Note that this pre-deploy script, particularly Docker service update object, is complicated. Hence, it is strongly recommended to use this pre-deploy method if you are an expert user. For example, note that how an empty string is being added to the deployed version in this line:

```
dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] = alacranAppObj.deployedVersion+ '';
```

Removing this simple hack, will throw an error when deploying apps. To see logs, you need to run `docker service logs alacran-alacran --follow`. Even the error from Docker is not very clear. All in all, this is an advanced feature and is not recommended for beginners and intermediate users.
