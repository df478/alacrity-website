---
id: deploy-from-gitlab
title: Deploying from Gitlab
sidebar_label: Deploy from GitLab
---



In this tutorial, we'll go over the deployment via GitLab. Having said that, GitHub is very similar. If you have any issues along the way, let us know!


### 1- Create GitLab Repository

If you don't have a GitLab account, create an account.
- Click on "New Project" to create a new repository
- Click on "Create blank project"
- Name your project and finish your project creation



### 2- Add Sample Source Code

For this tutorial we'll work with a very easy sample source code containing one file

`index.php`
```php
 <?php echo 'PHP output: Hello World!'; ?> 
```

Add, commit and push this file to your repository on GitLab. You should be seeing this file on the web UI of GitLab.



### 3- Dockerfile

In order to build on a 3rd party build system, you need to have a Dockerfile. If you're using a AlaCrity templateId, you can use the ready to go [Dockerfiles that are in AlaCrity repository](https://github.com/alacrity/alacrity/tree/ff3d124f967ee06732c13774e9e633d33b0982c4/dockerfiles).

In this tutorial, we'll use the PHP Dockerfile:

`Dockerfile`
```Dockerfile
FROM php:7.3-apache
COPY ./ /var/www/html/
```

**IMPORTANT** Make sure your `Dockerfile` is spelled exactly as this.

Add, commit and push this file.



### 4- Create an Access Token for AlaCrity

AlaCrity needs to pull the built images from GitLab, so we need to create an access token. Navigate to https://gitlab.com/-/profile/personal_access_tokens and create a token.

Make sure to assign `read_registry` and `write_registry` permissions for this token.

One you created the token move to the next step:



### 5- Add Token to AlaCrity

Login to your AlaCrity web dashboard, under `Cluster` click on `Add Remote Registry`. Then enter these fields:

- Username: `your gitlab username`
- Password: `your gitlab Token [From the previous step]`
- Domain: `registry.gitlab.com`
- Image Prefix: `again, your gitlab username`

NOTE: Image Prefix depends on how you structure your project in Gitlab. If you are using a group for your repository, your image prefix should be your group.
In general, image prefix is the part between the domain and image name. For example, `my-group-project` is the Image Prefix for this project:
```
registry.gitlab.com/my-group-project/test:latest
```

Save your registry.



### 6- Disable Default Push

Now that you added a registry, AlaCrity by default wants to push the built artifact to your registry. You do not need this for this tutorial, and it might make your deployments to fail. So go ahead and disable `Default Push`



### 7- Create a AlaCrity App

On AlaCrity dashboard and create an app, we call it `my-test-gitlab-deploy`



### 8- Create CI/CD Variables

Next, go to your project page on GitLab, navigate to `Settings > CI/CD`. Then, under `Variables` add the following variables:
- `Key` : `ALACRITY_URL` , `Value` : `https://alacran.root.domain.com [replace it with your domain]`
- `Key` : `ALACRITY_PASSWORD` , `Value` : `mYpAsSwOrD [replace it with your password]`
- `Key` : `ALACRITY_APP` , `Value` : `my-test-gitlab-deploy [replace it with your app name]`

Add all these 3 variables. For best security make sure they are they are protected. It's okay if they are not masked, they won't appear in logs.



### 9- GitLab CI File

So far, we have two files in our directory `index.php` and `Dockerfile`. Now let's add GitLab's specific build instructions:

**IMPORTANT** Make sure your `.gitlab-ci.yml` is spelled exactly as this. It starts with a dot.


`.gitlab-ci.yml`
```yaml
build-docker-master:
  image: docker:latest
  stage: build
  services:
    - docker:dind
  before_script:
    - export DOCKER_REGISTRY_USER=$CI_REGISTRY_USER # built-in GitLab Registry User
    - export DOCKER_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD # built-in GitLab Registry Password
    - export DOCKER_REGISTRY_URL=$CI_REGISTRY # built-in GitLab Registry URL
    - export COMMIT_HASH=$CI_COMMIT_SHA # Your current commit sha
    - export IMAGE_NAME_WITH_REGISTRY_PREFIX=$CI_REGISTRY_IMAGE # Your repository prefixed with GitLab Registry URL
    - docker login -u "$DOCKER_REGISTRY_USER" -p "$DOCKER_REGISTRY_PASSWORD" $DOCKER_REGISTRY_URL # Instructs GitLab to login to its registry

  script:
    - echo "Building..." # MAKE SURE NO SPACE ON EITHER SIDE OF = IN THE FOLLOWING LINE
    - export CONTAINER_FULL_IMAGE_NAME_WITH_TAG=$IMAGE_NAME_WITH_REGISTRY_PREFIX/my-build-image:$COMMIT_HASH
    - docker build -f ./Dockerfile --pull -t built-image-name .
    - docker tag built-image-name "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - docker push "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - echo $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
    - echo "Deploying on AlaCrity..."
    - docker run df478/cli-alacrity:latest alacrity deploy --alacrityUrl $ALACRITY_URL --alacrityPassword $ALACRITY_PASSWORD --alacrityApp $ALACRITY_APP --imageName $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
  only:
    - main
```

This is quite self-explanatory. **The best part is that you don't have to make any changes to this file!** It is the same file for all of your repositories regardless of their language or where you deploy them! 

The only 3 values that are different for this file, are the 3 `ALACRITY_***` values that you set in the previous step.


Commit and push this file to your GitLab repository. By now, your GitLab repository must have at least these 3 files
```bash
index.php
Dockerfile
.gitlab-ci.yml
```

Wait a little bit until your build is finished and deployed automatically! After a few minutes you can see your deployed app on AlaCrity!!!

#### Note on using `--imageName` with a private registry

If you encounter the following error when running `alacrity deploy --imageName`, you may need to authenticate your Alacran instance with your registry, as being logged in locally doesn't mean that AlaCrity can access the image.

```
Deploy failed!
Error: (HTTP code 404) unexpected - pull access denied for user_name/repo_name, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

**Log in to your private Docker repository on AlaCrity**:

- Navigate to CLUSTER
- Click on ADD REMOTE REGISTRY
- Enter your data and save your registry
- Now you can use `alacrity deploy --imageName` with your private image registry.


#### App Tokens

When you use CI/CD, it may be more desirable to avoid storing your password. Instead, you can create app specific tokens to deployment of each app. 

```
alacrity deploy --appToken <YOUR_APP_TOKEN_HERE> --alacrityUrl https://alacran.domain.com --imageName YOUR_IMAGE_NAME --appName YOUR_APP_NAME
```

Usually it is more secure to save token in an environment variable, CLI will load it from `ALACRITY_APP_TOKEN` variable.



#### Alternative Method

Alternatively, you can use a webhook instead of `docker run df478/cli-alacrity:latest alacrity deploy....`. This method is a bit more complex. 

The following is NOT A WORKING example. Instead, it's just a hint on what steps are needed for the webhook method to work.

```bash
    - echo "Deploying on AlaCrity..."
    - export DEPLOY_BRANCH=deploy-alacrity
    - cd ~
    - git clone your-repo
    - cd your-repo
    - git checkout $DEPLOY_BRANCH || git checkout -b $DEPLOY_BRANCH
    - git rm -rf .
    - git clean -fdx .
    - echo "{\"schemaVersion\":2,\"imageName\":\"$CONTAINER_FULL_IMAGE_NAME_WITH_TAG\"}" > alacran-definition
    - git add .
    - git commit -m "Deploy $CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - git push --set-upstream origin $DEPLOY_BRANCH
    - curl -X POST https://alacran.rootdomain.com/your-webhook
```
