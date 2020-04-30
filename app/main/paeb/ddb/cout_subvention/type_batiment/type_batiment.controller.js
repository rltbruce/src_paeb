(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_batiment')
        .controller('Type_batimentController', Type_batimentController);
    /** @ngInject */
    function Type_batimentController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        var NouvelItem=false;
      
      //recuperation donnée zone_subvention
        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
          console.log(vm.allzone_subvention);
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
        });
        

/* ***************DEBUT TYPE OUVRAGE**********************/

vm.mainGridOptions = {

       dataSource: new kendo.data.DataSource({   
         transport: {
              read: function (e)
              {
                apiFactory.getAll("type_batiment/index").then(function(result)
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
                          code:   e.data.models[0].code,      
                          libelle:   e.data.models[0].libelle,
                          description:   e.data.models[0].description,
                          nbr_salle:   e.data.models[0].nbr_salle,
                          cout_batiment:   e.data.models[0].cout_batiment,
                          id_zone_subvention:   e.data.models[0].zone_subvention.id,      
                          id_acces_zone:        e.data.models[0].acces_zone.id               
                      });
                  
                  apiFactory.add("type_batiment/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("type_batiment/index",datas, config).success(function (data)
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
                          code:   e.data.models[0].code,      
                          libelle:   e.data.models[0].libelle,
                          description:   e.data.models[0].description,
                          nbr_salle:   e.data.models[0].nbr_salle,
                          cout_batiment:   e.data.models[0].cout_batiment,
                          id_zone_subvention:   e.data.models[0].zone_subvention,      
                          id_acces_zone:        e.data.models[0].acces_zone                
                      });
                  console.log(e.data.models[0]);
                  apiFactory.add("type_batiment/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    var itemsAcces_zone =
                      {
                        id: e.data.models[0].acces_zone,
                        libelle: vm.libelleaccesZone
                      };

                      var itemsZone_subvention =
                      {
                        id: e.data.models[0].zone_subvention,
                        libelle: vm.libellezoneSubvention
                      };

                      e.data.models[0].acces_zone=itemsAcces_zone; 
                      e.data.models[0].zone_subvention=itemsZone_subvention;              
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
                        code: {type: "string",validation: {required: true}},
                        libelle: {type: "string",validation: {required: true}},
                        description: {type: "string",validation: {required: true}},
                        nbr_salle: {type: "string",validation: {required: true}},
                        zone_subvention: {validation: {required: true}},
                        acces_zone: { validation: {required: true}},
                        cout_batiment: {type: "number", validation: {required: true}}
                    }
                }
            },     
            //serverFiltering: true,
            pageSize: 10
          }),
          toolbar: [{               
               template: "<label id='table_titre'>TYPE BATIMENT</label>"
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
              field: "libelle",
              title: "Libelle",
              width: "Auto"
            },{
              field: "description",
              title: "Description",
              width: "Auto"
            },
            {
              field: "nbr_salle",
              title: "Nombre salle",
              width: "Auto"
            },{
              field: "zone_subvention",
              title: "Zone subvention",
              template: "{{dataItem.zone_subvention.libelle}}",
              editor: zoneSubventionDropDownEditor,
              width: "Auto"
            },
            {
              field: "acces_zone",
              title: "Acces zone",
              template: "{{dataItem.acces_zone.libelle}}",
              editor: accesZoneDropDownEditor,
              width: "Auto"
            },
            {
              field: "cout_batiment",
              title: "Cout_batiment",
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

      function zoneSubventionDropDownEditor(container, options)
          {
            $('<input id="zoneSubventionDropDownList" change="vm.mande()" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "id_zone_subvention",
                    dataSource: vm.allzone_subvention           
                }); 
                var zonesubventionContener = container.find("#zoneSubventionDropDownList").data("kendoDropDownList");
          
          zonesubventionContener.bind("change", function() {
          vm.libellezoneSubvention = zonesubventionContener.text();
          console.log(vm.libellezoneSubvention);
    
  });
          }

          function accesZoneDropDownEditor(container, options)
          {
          
            $('<input id="accesZoneDropDownList" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "id_acces_zone",
                    dataSource: vm.allacces_zone           
                });

            var acceszoneContener = container.find("#accesZoneDropDownList").data("kendoDropDownList");
          
            acceszoneContener.bind("change", function() {
            vm.libelleaccesZone = acceszoneContener.text();
            console.log(vm.libellezoneSubvention);
            });
          }

      vm.allattachement_batiment = function(id_type_batiment) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("attachement_batiment/index","id_type_batiment",id_type_batiment).then(function(result)
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
                          ponderation_batiment: e.data.models[0].ponderation_batiment,
                          id_type_batiment: e.data.models[0].type_batiment.id               
                      });
                  
                  apiFactory.add("attachement_batiment/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("attachement_batiment/index",datas, config).success(function (data)
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
                          ponderation_batiment:  e.data.models[0].ponderation_batiment,
                          id_type_batiment:   id_type_batiment               
                      });
                  
                  apiFactory.add("attachement_batiment/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].type_batiment={id:id_type_batiment};              
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
                        ponderation_batiment: {type: "number", validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>ATTACHEMENT</label>"
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
              field: "ponderation_batiment",
              title: "Ponderation batiment",
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

      vm.allattachement_latrine = function(id_annexe_latrine) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("attachement_latrine/index","id_annexe_latrine",id_annexe_latrine).then(function(result)
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
                          ponderation_latrine: e.data.models[0].ponderation_latrine,
                          id_annexe_latrine: e.data.models[0].annexe_latrine.id               
                      });
                  
                  apiFactory.add("attachement_latrine/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("attachement_latrine/index",datas, config).success(function (data)
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
                          ponderation_latrine:  e.data.models[0].ponderation_latrine,
                          id_annexe_latrine:   id_annexe_latrine               
                      });
                  
                  apiFactory.add("attachement_latrine/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].annexe_latrine={id:id_annexe_latrine};              
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
                        ponderation_latrine: {type: "number", validation: {required: true}}
                    }
                }
            },     
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>ATTACHEMENT</label>"
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
              field: "ponderation_latrine",
              title: "Ponderation latrine",
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

      vm.allattachement_mobilier = function(id_annexe_mobilier) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("attachement_mobilier/index","id_annexe_mobilier",id_annexe_mobilier).then(function(result)
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
                          ponderation_mobilier: e.data.models[0].ponderation_mobilier,
                          id_annexe_mobilier: e.data.models[0].annexe_mobilier.id               
                      });
                  
                  apiFactory.add("attachement_mobilier/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("attachement_mobilier/index",datas, config).success(function (data)
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
                          ponderation_mobilier:  e.data.models[0].ponderation_mobilier,
                          id_annexe_mobilier:   id_annexe_mobilier               
                      });
                  
                  apiFactory.add("attachement_mobilier/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);
                    e.data.models[0].annexe_mobilier={id:id_annexe_mobilier};              
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
                        ponderation_mobilier: {type: "number", validation: {required: true}}
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
              field: "ponderation_mobilier",
              title: "Ponderation mobilier",
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