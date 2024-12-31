const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getProjectById(id){
  const data = await fetchAPI(`
    query project {
      projects(first: 50, where: {id: ${id}}) {
        edges {
          node {
            content(format: RENDERED)
          }
        }
      }
    }`,
    {},
    );
  return data;
}

export async function getSettingsAPI(){
  const data = await fetchAPI(`
    query mainSetting {
      generalSettings {
        description
        title
      }
      menuItems(first: 30) {
        nodes {
          label
          url
          parentId
          id
          connectedObject {
            ... on ProjectCategories {
              name
              categoryOptions {
                date
              }
              termTaxonomyId
              id
              isTermNode
              description
            }
          }
          connectedNode {
            node {
              ... on Project {
                id
                link
                projectId
                title
              }
            }
          }
        }
      }
    }`,
    {},
    );
  return data;
}

export async function getStieOptions(){
  const data = await fetchAPI(`
    query siteOptions {
      customOptionsName {
        siteOptions {
          contactEmail
          socialLink
          socialLinkText
          siteDescription
          siteIntro
          ogImage {
            node {
              altText
              sourceUrl
              mimeType
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }`,
    {},
    );
  return data?.customOptionsName.siteOptions
}

export async function getInfo(){
  const data = await fetchAPI(`
    query infoPage {
      page(id: 405, idType: DATABASE_ID) {
        content
      }
    }`,
    {},);
  return data
  }

export async function getCats(){
  const data = await fetchAPI(`
    query projectCats {
      allProjectCategories {
        nodes {
          categoryOptions {
            date
          }
          description
          projects {
            nodes {
              title
            }
          }
          name
        }
      }
    }`,
{},
);
  return data
}