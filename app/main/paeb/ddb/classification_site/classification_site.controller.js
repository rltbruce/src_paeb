(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.classification_site')
        .controller('Classification_siteController', Classification_siteController);
    /** @ngInject */
    function Classification_siteController($mdDialog, $scope, apiFactory, $state)
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
                    apiFactory.getAll("classification_site/index").then(function success(response)
                    {
                        e.success(response.data.response)
     

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
                          libelle:      e.data.models[0].libelle,
                          description:       e.data.models[0].description               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("classification_site/index",datas, config).success(function (data)
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
                    apiFactory.add("classification_site/index",datas, config).success(function (data)
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
                            libelle:      e.data.models[0].libelle,
                            description:       e.data.models[0].description               
                        });
                    apiFactory.add("classification_site/index",datas, config).success(function (data)
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
                        libelle: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>CLASSIFICATION SITE </label>"
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

      vm.allsituation_participant_odc = function(id_classification_site) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("situation_participant_odc/index","id_classification_site",id_classification_site).then(function(result)
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
                          libelle:      e.data.models[0].libelle,
                          description:       e.data.models[0].description,
                          id_classification_site: e.data.models[0].classification_site.id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("situation_participant_odc/index",datas, config).success(function (data)
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
                  apiFactory.add("situation_participant_odc/index",datas, config).success(function (data)
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
                          libelle:      e.data.models[0].libelle,
                          description:       e.data.models[0].description,
                          id_classification_site: id_classification_site               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("situation_participant_odc/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response); 
                    e.data.models[0].classification_site={id:id_classification_site};             
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
                        libelle: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Fonction participant </label>"
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
                     // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };

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
