(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.localisation.region')
        .controller('RegionController', RegionController);
    /** @ngInject */
    function RegionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
        var vm = this;
        var NouvelItem=false;

        

/* ***************DEBUT GEOGRAPHIQUE**********************/

        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {
                read: function (e)
                {
                    apiFactory.getAll("region/index").then(function success(response)
                    {
                        e.success(response.data.response);
     

                        console.log(response.data.response);
                    }, function error(response)
                        {
                          alert('something went wrong')
                          console.log(response);
                        })
                },
                update : function (e)
                {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("region/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });
                                   
                     
                },
                destroy: function (e)
                {
                    console.log("destroy");
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    console.log(e.data.models);
                    var datas = $.param({
                            supprimer: 1,
                            id:        e.data.models[0].id               
                        });
                    apiFactory.add("region/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models); 
                    }).error(function (data)
                      {
                        //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                      });
               
                },
                create: function(e) {
                  console.log('create');
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    console.log(e.data.models);
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            code:      e.data.models[0].code,
                            nom:       e.data.models[0].nom               
                        });
                    apiFactory.add("region/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);
                      console.log(e.data.models); 
                    }).error(function (data)
                      {
                        //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                      });
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string",validation: {required: true}},
                        nom: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>REGION </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "nom",
              title: "Nom",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        console.log(e);
                        var data = this.dataItem(row);
                        console.log(data);
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };

/*function sourceDropDownEditor(container, options) {
  var Sources = [{ "SourceID": 1, "Source": "11" },
               { "SourceID": 2, "Source": "Source2" },
               { "SourceID": 3, "Source": "Source3" }];
    $('<input id="sourcesDropDownList" required data-text-field="Source" data-value-field="Source" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Source",
            dataValueField: "Source",
            dataSource: Sources           
        });
}*/
function clicke()
{
  console.log('to');
}
      vm.alldistrict = function(id_region) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("district/index","id_region",id_region).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  });
              },
              update : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_region: e.data.models[0].region.id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("district/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("district/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_region: id_region               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("district/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response); 
                    e.data.models[0].region={id:id_region};             
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              }
            },
            batch: true,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string",validation: {required: true}},
                        nom: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>DISTRICT </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
          scrollable: false,
          sortable: true,
          filterable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          //dataBound: function() {
                   // this.expandRow(this.tbody.find("tr.k-master-row").first());
               // },
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "nom",
              title: "Nom",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                     // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };

      vm.allcommune = function(id_district) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("commune/index","id_district",id_district).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  })
              },
              update : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_district: e.data.models[0].district.id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_district: id_district               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].district={id:id_district};              
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              }
            },
            batch: true,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string",validation: {required: true}},
                        nom: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>COMMUNE </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
          scrollable: false,
          sortable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          //dataBound: function() {
                   // this.expandRow(this.tbody.find("tr.k-master-row").first());
               // },
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "nom",
              title: "Nom",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };


            vm.allfokontany = function(id_commune) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("fokontany/index","id_commune",id_commune).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  })
              },
              update : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_commune: e.data.models[0].commune.id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("fokontany/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("fokontany/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  console.log("update");
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e.data.models);
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          nom:       e.data.models[0].nom,
                          id_commune: id_commune               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("fokontany/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].commune={id:id_commune};              
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      //vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              }
            },
            batch: true,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string",validation: {required: true}},
                        nom: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>FOKONTANY </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
          scrollable: false,
          sortable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          //dataBound: function() {
                   // this.expandRow(this.tbody.find("tr.k-master-row").first());
               // },
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "nom",
              title: "Nom",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };

/* ***************FIN GEOGRAPHIQUE**********************/
        
        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();
