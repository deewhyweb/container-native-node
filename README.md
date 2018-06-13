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
This project will make use of existing NPM modules where possible e.g. kube-probe, nodeshift, swagger-ui-express, and third party tools e.g. Istio for microservice management.  The output from this project will be a comprehensive example of cloud native node.js application development.

## Prerequisites
* Openshift 3.9 installation
* Openshift cli user with admin rights

## Proposed architecture

![Architecture](/assets/architecture.png)

# Installation Instructions

## Install Istio

* [Istio installation](/istio)

## Create project
```
oc new-project samplenode
```

<!-- ## Enable side car injection on per project basis

```
oc label namespace samplenode istio-injection=enabled
``` -->

## Install Mongo.db
From OCP portal, create a project "mongodb" and within this project deploy MongoDB (Ephemeral)

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

# Deploying components 
From each folder [cart, catalog, gateway, reviews] run 


```
npm run openshift
```

Once all components are deployed the list of pods should be: (Note each pod shows two containers ready)

![Pods](/assets/pods.png)

Each Pod should contain two containers e.g.

![Pod](/assets/pod.png)

# Test
```
curl http://gateway-samplenode.router.default.svc.cluster.local/products?[1-20]
```
The response from the curl command should be something like:

```
http://gateway-samplenode.router.default.svc.cluster.local/products?19 --> <stdout>
--_curl_--http://gateway-samplenode.router.default.svc.cluster.local/products?19
"[{\"_id\":\"5b08448645d5281f811b81f1\",\"product_id\":2,\"id\":\"B000JZ4HQO\",\"title\":\"Clickart 950 000 - Premier image pack (dvd-rom)\",\"description\":\"Clickart 950 000 - Premier image pack (dvd-rom)\",\"manufacturer\":\"Broderbund\",\"price\":100,\"image\":\"6.jpeg\",\"reviews\":\"[{\\\"_id\\\":\\\"5b08448645d5281f811b81f2\\\",\\\"product_id\\\":2,\\\"id\\\":\\\"B000JZ4HQO\\\",\\\"title\\\":\\\"Best product I've ever purchased\\\",\\\"userId\\\":\\\"Tom Smith\\\"}]\"}]"
```

# Service Discovery

Once the services are all operational, navigate to http://gateway-samplenode.router.default.svc.cluster.local/api-docs to view the swagger api ui.

![Swagger](/assets/swagger.png)



# Metrics
Once Jaeger is configured correctly, you should now see trace metrics e.g.

![Trace](/assets/trace.png)

and

![Trace](/assets/trace2.png)

And Directed Acyclic Graph e.g.

![Dag](/assets/dag.png)
# Introduce http fault
```
istioctl create -f ./http-fault.yaml
istioctl delete -f ./http-fault.yaml
```