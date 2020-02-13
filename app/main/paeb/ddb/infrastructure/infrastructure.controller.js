(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.infrastructure')
        .controller('InfrastructureController', InfrastructureController);
    /** @ngInject */
    function InfrastructureController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        var NouvelItem=false;
      
      //recuperation donnée zone_subvention
       /* apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
          console.log(vm.allzone_subvention);
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
        });*/
        

/* ***************DEBUT TYPE OUVRAGE**********************/

vm.mainGridOptions = {

       dataSource: new kendo.data.DataSource({   
         transport: {
              read: function (e)
              {
                apiFactory.getAll("infrastructure/index").then(function(result)
                {
                    e.success(result.data.response)
                    console.log(result.data.response);
                }, function error(result)
                  {
                      alert('something went wrong')
                  })
              },
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,
                          libelle:   e.data.models[0].libelle,
                          description:   e.data.models[0].description               
                      });
                  console.log(datas);
                  apiFactory.add("infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 
                  var datas = $.param({supprimer: 1,id: e.data.models[0].id});
                  
                  apiFactory.add("infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,
                          libelle:   e.data.models[0].libelle,
                          description:   e.data.models[0].description                 
                      });
                  
                  apiFactory.add("infrastructure/index",datas, config).success(function (data)
                  { e.data.models[0].id = String(data.response);             
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
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
                        libelle: {type: "string",validation: {required: true}},
                        description: {type: "string",validation: {required: true}}
                    }
                }
            },     
            //serverFiltering: true,
            pageSize: 10
          }),
          toolbar: [{               
               template: "<label id='table_titre'></label>"
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
              field: "libelle",
              title: "Libelle",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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

      
   vm.alldesignation_infrastructure = function(id_infrastructure) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("designation_infrastructure/index","id_infrastructure",id_infrastructure).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  })
              },
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,
                          designation:   e.data.models[0].designation,
                          description:   e.data.models[0].description,
                          id_infrastructure: e.data.models[0].infrastructure.id               
                      });
                  console.log(datas);
                  apiFactory.add("designation_infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 
                  var datas = $.param({supprimer: 1,id: e.data.models[0].id});
                  
                  apiFactory.add("designation_infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,
                          designation:   e.data.models[0].designation,
                          description:   e.data.models[0].description,
                          id_infrastructure:   id_infrastructure               
                      });
                  
                  apiFactory.add("designation_infrastructure/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].infrastructure={id:id_infrastructure};              
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
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
                        designation: {type: "string",validation: {required: true}},
                        description: {type: "string",validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'></label>"
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
              field: "designation",
              title: "Designation",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
      vm.allelement_a_verifier = function(id_designation_infrastructure) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("element_a_verifier/index","id_designation_infrastructure",id_designation_infrastructure).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  })
              },
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,
                          element_verifier:   e.data.models[0].element_verifier,
                          description:   e.data.models[0].description,
                          id_designation_infrastructure: e.data.models[0].infrastructure.id               
                      });
                  console.log(datas);
                  apiFactory.add("element_a_verifier/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              destroy : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 
                  var datas = $.param({supprimer: 1,id: e.data.models[0].id});
                  
                  apiFactory.add("element_a_verifier/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });      
              },
              create : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,
                          element_verifier:   e.data.models[0].element_verifier,
                          description:   e.data.models[0].description,
                          id_designation_infrastructure:   id_designation_infrastructure               
                      });
                  
                  apiFactory.add("element_a_verifier/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].infrastructure={id:id_designation_infrastructure};              
                    e.success(e.data.models); 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
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
                        element_verifier: {type: "string",validation: {required: true}},
                        description: {type: "string",validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'></label>"
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
              field: "element_verifier",
              title: "Element à verifier",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
      

     
    }
})();