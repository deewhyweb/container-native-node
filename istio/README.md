# Prerequisites
Openshift 3.9 (Kubernetes 1.9)
Openshift cli logged in as cluster admin role

# Install Istio
```
oc adm policy add-scc-to-user anyuid -z istio-ingress-service-account -n istio-system

oc adm policy add-scc-to-user anyuid -z istio-grafana-service-account -n istio-system

oc adm policy add-scc-to-user anyuid -z istio-prometheus-service-account -n istio-system

curl -L https://git.io/getLatestIstio | sh -

cd istio-0.7.1/

oc create -f install/kubernetes/istio.yaml

```

## Allow Istio container initializer
At the OS level, run the following command as root user to enter selinux permissive mode
```
setenforce 0
```

## Verify installation

```
oc project istio-system

oc get pods
istio-ca-2267585963-2hmfq        1/1       Running   0          1m
istio-ingress-3271581819-xcgmb   1/1       Running   0          2m
istio-mixer-3525126435-wnv2c     3/3       Running   0          13m
istio-pilot-1128596656-tzlxw     2/2       Running   0          2m


oc get svc
NAME            CLUSTER-IP       EXTERNAL-IP                     PORT(S)                                                             AGE
istio-ingress   172.30.90.231    172.29.252.237,172.29.252.237   80:31776/TCP,443:31241/TCP                                          5m
istio-mixer     172.30.158.157   <none>                          9091/TCP,15004/TCP,9093/TCP,9094/TCP,9102/TCP,9125/UDP,42422/TCP    17m
istio-pilot     172.30.107.192   <none>                          15003/TCP,15005/TCP,15007/TCP,15010/TCP,8080/TCP,9093/TCP,443/TCP   6m
```

# Install Istio Addons
```
oc adm policy add-scc-to-user anyuid -z prometheus -n istio-system
oc adm policy add-scc-to-user privileged -z prometheus -n istio-system
oc adm policy add-scc-to-user privileged -z grafana -n istio-system
oc adm policy add-scc-to-user anyuid -z grafana -n istio-system
oc create -f install/kubernetes/addons/prometheus.yaml
oc create -f install/kubernetes/addons/grafana.yaml
oc create -f install/kubernetes/addons/zipkin.yaml -->
oc expose svc grafana
```

## Install jaeger
```
oc create -n istio-system -f https://raw.githubusercontent.com/jaegertracing/jaeger-kubernetes/master/all-in-one/jaeger-all-in-one-template.yml

oc expose svc jaeger-query

```

# Install Istio Automatic sidecar injector

To install automatic sidecar injection you have to enable the kube certificate server api through some changes to your master config:
So in master-config.yaml add the following pluginConfig under admissionConfig:

```
admissionConfig:
  pluginConfig:
    MutatingAdmissionWebhook:
      configuration:
        apiVersion: v1
        disable: false
        kind: DefaultAdmissionConfig

```
and under kubernetesMasterConfig add the following controllerArguments:

```
kubernetesMasterConfig:
  controllerArguments:
    cluster-signing-cert-file: [ ca.crt ]
    cluster-signing-key-file: [ ca.key ]
```

Once these changes are made, restart OCP with the command:

```
systemctl restart atomic-openshift-master-*
```

## Install sidecar injector
```
oc adm policy add-scc-to-user anyuid -z istio-sidecar-injector-service-account -n istio-system

./install/kubernetes/webhook-create-signed-cert.sh --service istio-sidecar-injector --namespace istio-system --secret sidecar-injector-cer

oc create -f install/kubernetes/istio-sidecar-injector-configmap-release.yaml

cat install/kubernetes/istio-sidecar-injector.yaml | \
     ./install/kubernetes/webhook-patch-ca-bundle.sh > \
     install/kubernetes/istio-sidecar-injector-with-ca-bundle.yaml

oc create -f install/kubernetes/istio-sidecar-injector-with-ca-bundle.yaml

```
## Verify sidecar injector is running
```
oc get pods --namespace=istio-system | grep sidecar
istio-sidecar-injector-5b8c78fd6-qsqqc   1/1       Running   0          1h

```
## Enable side car injection on per project basis

```
oc label namespace <<project name>> istio-injection=enabled
```
Any deployments to this namespace will now automatically have the istio side car injected.

To verfiy this, take a look in the Openshift console at your application.  In this case it's the default Node.js sample app.
The Pod should show two containers ready:

![containers ready](/assets/containers.png)

Viewing the Pod should show the Istio sidecar container listed:

![pod view ready](/assets/podview.png)


