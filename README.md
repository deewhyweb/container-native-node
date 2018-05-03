oc adm policy add-scc-to-user privileged -z default -n nodeservice
oc create -f node-service.yaml
oc apply -f <(istioctl kube-inject -f node-service.yaml)