(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_mobilier')
        .controller('Pv_constatation_rubrique_mobilierController', Pv_constatation_rubrique_mobilierController);
    /** @ngInject */
    function Pv_constatation_rubrique_mobilierController($mdDialog, $scope, apiFactory, $state)
    {
		  var vm = this;      

/* ***************DEBUT**********************/

vm.mainGridOptions = {

       dataSource: new kendo.data.DataSource({   
         transport: {
              read: function (e)
              {
                apiFactory.getAll("pv_consta_rubrique_phase_mob/index").then(function(result)
                {
                    e.success(result.data.response);
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
                          description:   e.data.models[0].description,
                          numero:   e.data.models[0].numero,
                          pourcentage_prevu:   e.data.models[0].pourcentage_prevu               
                      });
                  console.log(e);
                  apiFactory.add("pv_consta_rubrique_phase_mob/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("pv_consta_rubrique_phase_mob/index",datas, config).success(function (data)
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
                          description:   e.data.models[0].description,
                          numero:   e.data.models[0].numero,
                          pourcentage_prevu:   e.data.models[0].pourcentage_prevu                 
                      });
                  apiFactory.add("pv_consta_rubrique_phase_mob/index",datas, config).success(function (data)
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
                        description: {type: "string",validation: {required: true}},
                        numero: {type: "number",validation: {required: true}},
                        pourcentage_prevu: {type: "number",validation: {required: true, min:1}, decimals:3}
                        //,editable: false
                        //, min: 1
                    }
                }
            },     
            //serverFiltering: true,
            pageSize: 10
          }),
          toolbar: [{               
               template: "<label id='table_titre'>PHASE</label>"
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
         /* dataBound: function() {
                },*/
          columns: [
            {
              field: "numero",
              title: "Numero",
              width: "Auto"
            },
            {
              field: "libelle",
              title: "Libelle",
              width: "Auto"
            },{
              field: "description",
              title: "Description",
              width: "Auto"
            },{
              field: "pourcentage_prevu",
              title: "Pourcentage prevu",
              format: "{0:n3}",
              width: "Auto",
              editor: numberEditor,
              culture:"fr-FR"
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
        function numberEditor(container, options) {
          $('<input name="' + options.field + '"/>')
                  .appendTo(container)
                  .kendoNumericTextBox({
                      format  : "{0:n3}",
                      decimals: 3,
                      step    : 0.001,
                      culture:"fr-FR"

                  });
                  var culture = kendo.culture();
console.log(culture.name);
      }

      vm.allpv_consta_rubrique_designation_mob = function(id_rubrique_phase) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_designation_mob/index","menu","getrubrique_designation_mob","id_rubrique_phase",id_rubrique_phase).then(function(result)
                {
                    e.success(result.data.response)
                }, function error(result)
                  {
                      alert('something went wrong')
                  });
              },
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          libelle:   e.data.models[0].libelle,
                          description: e.data.models[0].description,
                          numero: e.data.models[0].numero,
                          id_rubrique_phase: e.data.models[0].id_rubrique_phase               
                      });
                  
                  apiFactory.add("pv_consta_rubrique_designation_mob/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("pv_consta_rubrique_designation_mob/index",datas, config).success(function (data)
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
                          numero:  e.data.models[0].numero,
                          id_rubrique_phase :   id_rubrique_phase                
                      });
                 // console.log(datas);
                  apiFactory.add("pv_consta_rubrique_designation_mob/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].id_rubrique_phase=id_rubrique_phase;              
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
                        description: {type: "string", validation: {required: true}},
                        numero: {type: "number", validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>DESIGNATION</label>"
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
              field: "numero",
              title: "Numero",
              width: "Auto"
            },
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

  

/* ***************FIN**********************/
        
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