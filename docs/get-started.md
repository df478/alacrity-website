---
id: get-started
title: Getting Started
sidebar_label: Getting Started
---

## Simple Setup

## Prerequisites

### A) Domain Name

During installation, you'll be asked to point a wildcard DNS entry to your AlaCrity IP Address.

Note that you can use AlaCrity without a domain too. But you won't be able to setup HTTPS.

### B) Server

#### B1) Public IP

_Side note: You can [install AlaCrity locally](run-locally.md) on your laptop on a private network which is behind NAT (your router). But if you want to enable HTTPS and/or access the apps from outside of your private network, it requires some special setup, like port forwarding._

In standard installation, AlaCrity has to be installed on a machine with a public IP address. If you need help with Public IP, see [Server & Public IP address](server-purchase/digitalocean.md).

#### B2) Server Specs

_**CPU Architecture**:_ AlaCrity source code is compatible with any CPU architecture and the Docker build available on Docker Hub is built for AMD64 (X86), ARM64, and ARMV7 CPUs.

_**Recommended Stack**:_ AlaCrity is tested on Ubuntu 22.04 and Docker 25+.

_**Minimum RAM**:_ Note that the build process sometimes consumes too much RAM, and 512MB RAM might not be enough. Most providers offer a minimum of 1GB RAM on \$5 instance including DigitalOcean, Vultr, Scaleway, Linode, SSD Nodes and etc.

#### B3) Docker

Your server must have Docker installed on it. Also, you can install Docker CE by following [this instruction](https://docs.docker.com/engine/installation). Note that your Docker version needs to be, at least, version 25.x+.

**AVOID snap installation** [snap installation of Docker is buggy](https://github.com/alacrity/alacrity/issues/501#issuecomment-554764942). Use the official installation instructions for Docker.

#### B4) Configure Firewall

Some server providers have strict firewall settings. To disable firewall on Ubuntu:

```bash
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

See [firewall settings](firewall.md) if you need more details.

<br/>
<br/>

# AlaCrity Setup

## Step 1: AlaCrity Installation

Just run the following line, sit back and enjoy!

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /alacran:/alacran df478/alacrity
```

NOTE: do not change the port mappings. AlaCrity only works on the specified ports.

You will see a bunch of outputs on your screen. Once the AlaCrity is initialized, you can visit `http://[IP_OF_YOUR_SERVER]:3000` in your browser and login to AlaCrity using the default password `alacran42`. You can change your password later. **However, do not make any changes in the dashboard**. We'll use the command line tool to setup the server (recommended).

## Step 2: Connect Root Domain

Let's say you own `mydomain.com`. You can set `*.something.mydomain.com` as an `A-record` in your DNS settings to point to the IP address of the server where you installed AlaCrity. Note that it can take several hours for this change to take into effect. It will show up like this in your DNS configs:

- **TYPE**: A record
- **HOST**: `*.something`
- **POINTS TO**: (IP Address of your server)
- **TTL**: (doesn't really matter)

To confirm, go to https://mxtoolbox.com/DNSLookup.aspx and enter `randomthing123.something.mydomain.com` and check if IP address resolves to the IP you set in your DNS. Note that `randomthing123` is needed because you set a wildcard entry in your DNS by setting `*.something` as your host, not `something`.

> **NOTE**: AlaCrity requires A Record to be pointing to AlaCrity's IP Address. If you use proxy services, such as Cloudflare, you may face difficulties. AlaCrity does not officially support such use cases.

## Step 3: Configure and initialize AlaCrity

### With CLI (recommended)

Assuming you have npm installed on your local machine (e.g., your laptop), simply run (add `sudo` if needed):

```bash
 npm install -g alacrity-cli
```

Then, run

```bash
 alacrity serversetup
```

Follow the steps and login to your AlaCrity instance. When prompted to enter the root domain, enter `something.mydomain.com` assuming that you set `*.something.mydomain.com` to point to your IP address in step #2. Now you can access your AlaCrity from `alacran.something.mydomain.com`. You can read more about hiding the root domain [here](./best-practices.md#hidden-root-domain).

> **NOTE**: **It will not be possible to carry through with the `alacrity serversetup` if you've already forced https on your AlaCrity instance.**
> In such case go straight to logging in with the `alacrity login` command. To change the password go to the settings menu in the app.

### With the web interface (doesn't require npm)

1. Login to `http://[IP_OF_YOUR_SERVER]:3000`
2. Configure the root domain
3. Enable HTTPS, then force it
4. Once you are connected through HTTPS, change the default password (`alacran42`)

## Step 4: (Optional) Set up Swap file

In some cases you may run into problems due to not having enough physical RAM.
For example, when building a Docker image, if it starts to take up too much memory, the build will fail.
To work around these problems (without purchasing more RAM) you can set up a Swap file (which is used as virtual RAM),
by following these instructions on [How To Create A Linux Swap File](https://linuxize.com/post/create-a-linux-swap-file/).

## Step 5: Deploy the Test App

Go to the AlaCrity in your browser, from the left menu select Apps and create a new app. Name it `my-first-app`. Then, download any of the test apps, unzip the content. and while inside the directory of the test app, run:

```bash
/home/Desktop/alacran-examples/alacran-node$  alacrity deploy
```

Follow the instructions, enter `my-first-app` when asked for app name. First time build takes about two minutes. After build is completed, visit `my-first-app.something.mydomain.com` where `something.mydomain.com` is your root domain.
CONGRATS! Your app is live!!

You can connect multiple custom domains (like `www.my-app.com`) to a single app and enable HTTPS and do much more in the app's settings page.

Note that when you run `alacrity deploy`, the current git commit will be sent over to your server.

> **IMPORTANT**: Uncommitted files and files in `gitignore` WILL NOT be sent to the server.

You can visit AlaCrity in the browser and set custom parameters for your app such as environment variables, and do much more! For more details regarding deployment, please see [CLI docs](cli-commands.md). For details on `alacran-definition` file, see [Alacran Definition File](alacran-definition-file.md).
