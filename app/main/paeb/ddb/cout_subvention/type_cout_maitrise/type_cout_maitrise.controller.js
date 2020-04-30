(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.type_cout_maitrise')
        .controller('Type_cout_maitriseController', Type_cout_maitriseController);
    /** @ngInject */
    function Type_cout_maitriseController($mdDialog, $scope, apiFactory, $state)
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
                apiFactory.getAll("type_cout_maitrise/index").then(function(result)
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
                          cout_maitrise:   e.data.models[0].cout_maitrise,
                          id_zone_subvention:   e.data.models[0].zone_subvention.id,      
                          id_acces_zone:        e.data.models[0].acces_zone.id               
                      });
                  
                  apiFactory.add("type_cout_maitrise/index",datas, config).success(function (data)
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
                  
                  apiFactory.add("type_cout_maitrise/index",datas, config).success(function (data)
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
                          cout_maitrise:   e.data.models[0].cout_maitrise,
                          id_zone_subvention:   e.data.models[0].zone_subvention,      
                          id_acces_zone:        e.data.models[0].acces_zone                
                      });
                  console.log(e.data.models[0]);
                  apiFactory.add("type_cout_maitrise/index",datas, config).success(function (data)
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
                        zone_subvention: {validation: {required: true}},
                        acces_zone: { validation: {required: true}},
                        cout_maitrise: {type: "number", validation: {required: true}}
                    }
                }
            },     
            //serverFiltering: true,
            pageSize: 10
          }),
          toolbar: [{               
               template: "<label id='table_titre'>Cout Maitrise d'oeuvre</label>"
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
              field: "cout_maitrise",
              title: "cout_maitrise",
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