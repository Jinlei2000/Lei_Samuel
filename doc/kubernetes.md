# Kubernetes

## Azure Kubernetes Service (AKS)

Make a new resource group & create a new AKS cluster

Than open the Azure Cloud Shell and run the following commands:

```bash
az aks get-credentials --resource-group tuinbouw --name aks-tuinbouw
```

Create a namespace for the project in the cluster

Switch to the namespace

```bash
kubectl config set-context --current --namespace=tuinbouw
```

Push the images to the Docker Hub

```bash
docker tag api-tuinbouw-production-api jinlei2000/api-tuinbouw-production-api
docker tag api-tuinbouw-production-tuinbouw jinlei2000/api-tuinbouw-production-tuinbouw
```

```bash	
docker push jinlei2000/api-tuinbouw-production-api
docker push jinlei2000/api-tuinbouw-production-tuinbouw
```

First add a firebase-admin credentials file to the cluster

Open the Azure Cloud Shell and run the following commands:

```bash
touch credentials.json
```

Open the file

```bash
nano credentials.json
```

Copy the firebase-admin credentials to the file

```bash
kubectl create secret generic my-google-secret --from-file=credentials.json
```

Now apply all the Kubernetes files in the `kubernetes` folder 

Go to the dashboard

- Add mongo presistent volume claim & presistent volume to the dashboard
- Add all the services to the dashboard
- Add configmap to the dashboard
- Add all the deployments to the dashboard

When your services is added copy the external IPs and place inside the `configmap.yaml` file

```yaml
# configmap-api.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-configmap
  namespace: tuinbouw
data:
  MAIL_USER: # mail user
  MAIL_PASSWORD: # mail password
  MAIL_FROM: noreply@noreply.com
  URL_FRONTEND: # external ip of the frontend service
  DB_HOST: mongodb
  DB_PORT: '27017'
  DB_NAME: api
  NODE_ENV: production
  FIREBASE_STORAGE_BUCKET: # firebase storage bucket
  CLI_PATH: ./packages/api/dist/cli.js
  GOOGLE_APPLICATION_CREDENTIALS: /app/google-credentials/credentials.json
```

```yaml
# configmap-tuinbouw.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tuinbouw-configmap
  namespace: tuinbouw
data:
  VITE_apiKey: # firebase api key
  VITE_authDomain: # firebase auth domain
  VITE_projectId: # firebase project id
  VITE_storageBucket: # firebase storage bucket
  VITE_messagingSenderId: # firebase messaging sender id
  VITE_appId: # firebase app id
  VITE_BACKEND_URL: # external ip of the api service
  VITE_TOMTOM_API_KEY: # tomtom api key
  VITE_OPENWEATHER_apiKey: # openweather api key
  VITE_LOGROCKET_ID: # logrocket id
```



