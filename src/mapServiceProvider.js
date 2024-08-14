// export class MapServiceProvider extends ProviderBase {
//   constructor(serviceUrl, searchField, options = {}) {
//     super();

//     this.searchField = searchField;
//     this.contextField = options.contextField;
//     this.serviceUrl = serviceUrl;

//     this.setUpQueryTask(options);
//   }

//   async setUpQueryTask(options) {
//     const defaultWkid = 3857;
//     this.query = new Query();
//     this.query.outFields = this.getOutFields(options.outFields, this.searchField, options.contextField);
//     this.query.returnGeometry = false;
//     this.query.outSpatialReference = { wkid: options.wkid || defaultWkid };
//   }

//   async search(searchString) {
//     this.query.where = this.getSearchClause(searchString);
//     const featureSet = await executeQueryJSON(this.serviceUrl, this.query);

//     return { data: featureSet.features };
//   }

//   async getFeature(searchValue, contextValue) {
//     this.query.where = this.getFeatureClause(searchValue, contextValue);
//     this.query.returnGeometry = true;
//     const featureSet = await executeQueryJSON(this.serviceUrl, this.query);

//     return { data: featureSet.features };
//   }
// }

export const mapServiceProvider = ({ url, field, options }) => {
  return {
    load: async () => {},
    getFeatures: async () => {},
  };
};
