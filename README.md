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
* Openshift 3.7 installation (tested with v3.7.42)
* Openshift cli user with admin rights

## Proposed architecture

![Architecture](/assets/architecture.png)

# Installation Instructions

## Istio
```
oc adm policy add-scc-to-user anyuid -z istio-ingress-service-account -n istio-system

oc adm policy add-scc-to-user anyuid -z istio-grafana-service-account -n istio-system

oc adm policy add-scc-to-user anyuid -z istio-prometheus-service-account -n istio-system

curl -L https://git.io/getLatestIstio | sh -

cd istio-0.7.1/

oc create -f install/kubernetes/istio.yaml

oc project istio-system
```

## Istio Addons
```
oc adm policy add-scc-to-user anyuid -z prometheus -n istio-system
oc adm policy add-scc-to-user privileged -z prometheus -n istio-system
oc adm policy add-scc-to-user privileged -z grafana -n istio-system
oc adm policy add-scc-to-user anyuid -z grafana -n istio-system
oc create -f install/kubernetes/addons/prometheus.yaml
oc create -f install/kubernetes/addons/grafana.yaml
oc create -f install/kubernetes/addons/servicegraph.yaml
oc expose svc grafana
oc expose svc servicegraph
SERVICEGRAPH=$(oc get route servicegraph -o jsonpath='{.spec.host}{"\n"}')/dotviz
GRAFANA=$(oc get route grafana -o jsonpath='{.spec.host}{"\n"}')

oc apply -n istio-system -f https://raw.githubusercontent.com/jaegertracing/jaeger-kubernetes/master/all-in-one/jaeger-all-in-one-template.yml
oc expose svc jaeger
```

## Allow Istio container initializer
```
setenforce 0
```

## Create project and allow istio priveledges
```
oc new-project nodeservice
oc adm policy add-scc-to-user privileged -z default -n nodeservice
```

## Install Mongo.db
```
oc create -f mongodb.yaml
```

## Install node-service
```
oc apply -f <(istioctl kube-inject -f node-service.yaml)
```

# Building and tagging images

```
docker build --rm -f Dockerfile -t node-service:latest .
docker tag 0ab4f236f9ca docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest .


docker tag 78e0b31fd5e8 docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest .

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/reviews:latest .

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/cart:latest .
```

# Introduce http fault
```
istioctl create -f ./http-fault.yaml
istioctl delete -f ./http-fault.yaml
```