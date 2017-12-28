import { promisify } from 'util'
const google = require('googleapis');

export function getVMTemplate({ templateName, projectName, applicationKeyPath }) {
    // Environment variables as required by Google's API client driver
    process.env.GCLOUD_PROJECT = projectName
    process.env.GOOGLE_APPLICATION_CREDENTIALS = applicationKeyPath

    return new Promise((resolve, reject) => {
        google.auth.getApplicationDefault(async (error, authClient, projectId) => {
            if (error) throw error
        
            // The createScopedRequired method returns true when running on GAE or a local developer
            // machine. In that case, the desired scopes must be passed in manually. When the code is
            // running in GCE or a Managed VM, the scopes are pulled from the GCE metadata server.
            // See https://cloud.google.com/compute/docs/authentication for more information.
            if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                // Scopes can be specified either as an array or as a single, space-delimited string.
                authClient = authClient.createScoped([
                    'https://www.googleapis.com/auth/compute'
                ]);
            }
        
            // Fetch the list of GCE zones within a project.
            var compute = google.compute({
                version: 'v1',
                auth: authClient
            });
        
            let result = await promisify(compute.instanceTemplates.get)({
                project: projectId,
                auth: authClient,
                instanceTemplate: templateName
            })
            resolve(result)
        })
    })
}