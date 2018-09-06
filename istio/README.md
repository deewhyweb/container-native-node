Download istio version of oc from https://github.com/openshift-istio/origin/releases

./istiooc_darwin cluster up --istio=true --istio-kiali-username=john --istio-kiali-password=password

Uodate the deployment config for kiali
set image to kiali/kiali:latest

Update the deployment for istio-statsd-prom-bridge
set image to docker.io/prom/statsd-exporter:v0.6.0

