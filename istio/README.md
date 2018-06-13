 # Installation istructions taken from:  
 https://github.com/openshift-istio/openshift-ansible/blob/istio-3.9-0.7.1/istio/Installation.md

On the master node:

Change to the directory containing the master configuration file (master-config.yaml) e.g. /etc/origin/master

Create a file named master-config.patch with the following contents

```
admissionConfig:
  pluginConfig:
    MutatingAdmissionWebhook:
      configuration:
        apiVersion: v1
        disable: false
        kind: DefaultAdmissionConfig
kubernetesMasterConfig:
  controllerArguments:
    cluster-signing-cert-file:
    - ca.crt
    cluster-signing-key-file:
    - ca.key
```

Run the following commands to patch the master-config.yml file and restart the atomic openshift master services:

```
cp -p master-config.yaml master-config.yaml.prepatch
oc ex config patch master-config.yaml.prepatch -p "$(cat ./master-config.patch)" > master-config.yaml
systemctl restart atomic-openshift-master*
```

In order to run the Elasticsearch application it is necessary to make a change to the kernel configuration on each node, this change will be handled through the sysctl service.
Create a file named /etc/sysctl.d/99-elasticsearch.conf with the following contents
```
vm.max_map_count = 262144
```

Execute the following command
```
sysctl vm.max_map_count=262144
```

On a machine with an oc user logged in with cluster-admin rights, clone the openshift-istio repo locally
```
git clone https://github.com/openshift-istio/openshift-ansible.git
cd openshift-ansible/istio
```

Run the istio installer template
oc new-app istio_installer_template.yaml --param=OPENSHIFT_ISTIO_MASTER_PUBLIC_URL=master public url

Verify the installation
```
oc get pods -n istio-system -w
```

You should see a list similar to:

```
NAME                                      READY     STATUS      RESTARTS   AGE
elasticsearch-0                           1/1       Running     0          18s
elasticsearch-1                           1/1       Running     0          3s
grafana-6f4fd4986f-tzkzl                  1/1       Running     0          25s
istio-ca-ddb878d84-mknp6                  1/1       Running     0          43s
istio-ingress-76b5496c58-4v9s8            1/1       Running     0          43s
istio-mixer-56f49dc667-4nl2v              3/3       Running     0          44s
istio-mixer-validator-65c7fccc64-rj8dd    1/1       Running     0          43s
istio-pilot-76dd785958-tb2fn              2/2       Running     0          44s
istio-sidecar-injector-599d8c454c-7pv7b   1/1       Running     0          35s
jaeger-agent-rfkkk                        1/1       Running     0          1s
jaeger-collector-b86c6bf8d-p5g7p          1/1       Running     0          2s
jaeger-query-6c8c85454-kzz82              1/1       Running     0          2s
openshift-ansible-istio-job-zg6nv         0/1       Completed   0          1m
prometheus-cf8456855-n4qd9                1/1       Running     0          24s

```

