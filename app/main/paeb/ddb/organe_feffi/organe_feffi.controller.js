(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.organe_feffi')
        .controller('Organe_feffiController', Organe_feffiController);
    /** @ngInject */
    function Organe_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		  var vm = this;
      var NouvelItem=false;        

/* ***************DEBUT TYPE OUVRAGE**********************/

vm.mainGridOptions = {

       dataSource: new kendo.data.DataSource({   
         transport: {
              read: function (e)
              {
                apiFactory.getAll("organe_feffi/index").then(function(result)
                {
                    e.success(result.data.response);
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
                  
                  apiFactory.add("organe_feffi/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("organe_feffi/index",datas, config).success(function (data)
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
                  console.log(e.data.models[0]);
                  apiFactory.add("organe_feffi/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);             
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
                        //,editable: false
                        //, min: 1
                    }
                }
            },     
            //serverFiltering: true,
            pageSize: 10
          }),
          toolbar: [{               
               template: "<label id='table_titre'>Rubrique</label>"
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
            },{
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


      vm.allfonction_feffi = function(id_organe_feffi) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("fonction_feffi/index","menu","getfonctionbyorgane","id_organe_feffi",id_organe_feffi).then(function(result)
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
                          libelle:   e.data.models[0].libelle,
                          description: e.data.models[0].description,
                          id_organe_feffi: e.data.models[0].id_organe_feffi               
                      });
                  
                  apiFactory.add("fonction_feffi/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("fonction_feffi/index",datas, config).success(function (data)
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
                          libelle:      e.data.models[0].libelle,
                          description:  e.data.models[0].description,
                          id_organe_feffi:   id_organe_feffi               
                      });
                 // console.log(datas);
                  apiFactory.add("fonction_feffi/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].id_organe_feffi=id_organe_feffi;              
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
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Sous rubrique</label>"
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
      };

     

/* ***************FIN TYPE OUVRAGE**********************/
        
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