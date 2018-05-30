# Node.js container native design POC
Proof of concept of Node.js container native design implementing the following tenets:

* DevOps automation
* Single concern principle
* Service discovery
* High Observability
* Lifecycle conformance
* Runtime confinement
* Process disposability
* Image immutability


The scope of the project is to produce a working node.js based e-commerce application using the above principles.
The proposed approach is to create a simple node.js based application based on microservices, incorporating container native design technologies such as high observability, image immutability, and process disposability.
This project will make use of existing NPM modules where possible e.g. nodeshift, and third party tools e.g. Istio for microservice management.  The output from this project will be a comprehensive example of cloud native node.js application development.

## Prerequisites
* Openshift 3.9 installation
* Openshift cli user with admin rights

## Proposed architecture

![Architecture](/assets/architecture.png)

# Installation Instructions

## Install Istio

* [Istio installation](/istio)

## Create project and allow istio priveledges
```
oc new-project nodeservice
oc adm policy add-scc-to-user privileged -z default -n nodeservice
```

## Enable side car injection on per project basis

```
oc label namespace nodeservice istio-injection=enabled
```

## Install Mongo.db
```
oc create -f mongodb.yaml
```

## Install mongo sample data
!!Will change!!

From Mongo pod terminal
```
mongo login --username admin --password admin_pass admin

use test
db.products.insert({"product_id":2.0,"id":"B000JZ4HQO","title":"Clickart 950 000 - Premier image pack (dvd-rom)","description":"Clickart 950 000 - Premier image pack (dvd-rom)","manufacturer":"Broderbund","price":100.0,"image":"6.jpeg"})
db.reviews.insert({"product_id":2.0,"id":"B000JZ4HQO","title":"Best product I've ever purchased","userId":"Tom Smith"})
db.cart.insert({"product_id":2.0,"id":"B000JZ4HQO","quantity": "1","userId":"Tom Smith"})
```

# Injecting the istio sidecar
From each folder [cart, catalog, gateway, reviews] run 
```
mv .nodeshift/deployment.yml .nodeshift/deployment.tmp
istioctl kube-inject -f .nodeshift/deployment.tmp > .nodeshift/deployment.yml
rm .nodeshift/deployment.tmp
```

# Deploying components 
From each folder [cart, catalog, gateway, reviews] run 


```
npm run openshift
```

# Test
```
curl http://gwservice-samplenode.router.default.svc.cluster.local/products?[1-20]
```

# Introduce http fault
```
istioctl create -f ./http-fault.yaml
istioctl delete -f ./http-fault.yaml
```