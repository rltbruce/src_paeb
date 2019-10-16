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
        /*vm.ajout = ajout ;*/
        var NouvelItem=false;
       /* var currentItem;
        vm.selectedItem = {} ;
        vm.allregion = [] ;
        vm.showTableRegion = true;

        vm.ajout_district = ajout_district ;
        var NouvelItem_district=false;
        var currentItem_district;
        vm.selectedItem_district = {} ;
        vm.alldistrict= [] ; 
        vm.boutonAjoutDistrict = false;
        vm.showTableDistrict = true;

        vm.ajout_commune = ajout_commune ;
        var NouvelItem_commune=false;
        var currentItem_commune;
        vm.selectedItem_commune = {} ;
        vm.allcommune= [] ; 
        vm.boutonAjoutCommune = false;
        vm.showTableCommune = true;
        vm.isCollapsed = false;       
       
        //styleorder : [1,'asc']
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          ordering : false,
          iDisplayLength : 20,
          lengthMenu : [ 5,10, 25, 50, 100 ]
          
        };

        //col table
        vm.region_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];
        vm.district_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];
        vm.commune_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];*/

       /* apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response; 
            console.log(vm.allregion);

            vm.mainGridOptions = {
       
          dataSource: {
            type: "json",
            data:vm.allregion,
            serverFiltering: true,
            pageSize: 5,
          },
          selectable:"row",
          //scrollable: false,
          //sortable: true,
          //pageable: true,
          
      };
            
            
        });
        
      vm.gridColumns = [
    { field: "code", title: "Code" },
    { field: "nom", title: "Nom" }
  ];*/
        

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
               name: "create",
               text:"Ajout",
               iconClass: "k-icon k-i-edit"
          }],
         /* edit: function(e)
          {
              NouvelItem = false;
              var grid = e.sender;
              var rows = grid.tbody.find("[role='row']");
              var tr = $(e.target).closest("tr");
              tr.addClass("k-state-selected");
          },*/
          /*cancel : function (e)
          {
              console.log("cancel");
              console.log(e);
              NouvelItem = false;
               
          },*/
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
                      text: {edit: "Editer",update: "Modifier",cancel: "Annuler"},
                      iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                        },
                  },{name: "destroy", text: "Supprimer"}]
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
      vm.alldistrict = function(id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("district/index","id_region",id).then(function(result)
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
                          id_region: id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("district/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);              
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
               name: "create",
               text:"Ajout",
               iconClass: "k-icon k-i-edit"
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
                      text: {edit: "Editer",update: "Modifier",cancel: "Annuler"},
                      iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                        },
                  },{name: "destroy", text: "Supprimer"}]
            }]
        };
      };

      vm.allcommune = function(id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("commune/index","id_district",id).then(function(result)
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
                          id_district: id               
                      });
                  console.log(e.data.models);
                  console.log(datas);
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  { 
                    e.data.models[0].id = String(data.response);              
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
               name: "create",
               text:"Ajout",
               iconClass: "k-icon k-i-edit"
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
                      text: {edit: "Editer",update: "Modifier",cancel: "Annuler"},
                      iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                        },
                  },{name: "destroy", text: "Supprimer"}]
            }]
        };
      };

/* ***************FIN GEOGRAPHIQUE**********************/



/* ***************DEBUT REGION**********************/
       
       /* apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response; 
            console.log(vm.allregion);
        });*/
        
        //fonction d'insertion ou mise a jours ou suppression item dans bdd region
        function insert_in_base(region,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = region.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      region.code,
                    nom:       region.nom               
                });
                //console.log(region.pays_id);
                //factory
            apiFactory.add("region/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = region.nom;
                        vm.selectedItem.code       = region.code;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allregion = vm.allregion.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  region.nom =  region.nom;
                  region.code=  region.code;
                  region.id  =   String(data.response);              
                  NouvelItem=false;
            }
              region.$selected = false;
              region.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            if (vm.selectedItem.id!='0')
            {
              apiFactory.getAPIgeneraliserREST("district/index","id_region",item.id).then(function(result)
              {
                  vm.alldistrict= result.data.response; 
                  vm.boutonAjoutDistrict = true;
              });
            }
            vm.allcommune= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allregion) return;
             vm.allregion.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });
        
        //function cache masque de saisie ajout region
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;         
            vm.allregion.push(items);
            vm.allregion.forEach(function(reg)
            {
              if(reg.$selected==true)
              {
                vm.selectedItem = reg;
              }
            });

            NouvelItem = true ;
            vm.boutonAjoutDistrict = false;
            vm.alldistrict = [];
          }else
          {
            vm.showAlert('Ajout Region','Un formulaire d\'ajout est déjà ouvert!!!');
          }
                
                      
        };

        //fonction de bouton d'annulation region
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.nom       = currentItem.nom ; 
          }else
          {
            vm.allregion = vm.allregion.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };
        //fonction masque de saisie modification region
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allregion.forEach(function(reg) {
              reg.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.nom       = vm.selectedItem.nom ; 
        };
        
        //fonction bouton suppression item region
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItem,1);
                vm.boutonAjoutDistrict = false;
              }, function() {
                //alert('rien');
              });
        };

         //function teste s'il existe une modification item region
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var reg = vm.allregion.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(reg[0])
                {
                   if((reg[0].nom!=currentItem.nom) || (reg[0].code!=currentItem.code))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }

        vm.show_region = function()
        {
          vm.showTableRegion = !vm.showTableRegion;
        }
/* ***************FIN REGION**********************/        

/* ***************DEBUT DISTRICT**********************/
     /*   function ajout_district(district,suppression)
        {
            if (NouvelItem_district==false)
            {
                test_existance_district (district,suppression); 
            } 
            else
            { 
                insert_in_base_district(district,suppression);
            }
        }

        //fonction d'insertion ou mise a jours ou suppression item dans bdd district
        function insert_in_base_district(district,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var getId = 0;
            if (NouvelItem_district==false)
            {
                getId = vm.selectedItem_district.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      district.code,
                    nom:       district.nom,
                    id_region: vm.selectedItem.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("district/index",datas, config).success(function (data)
            {
                if (NouvelItem_district == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem_district.nom        = district.nom;
                        vm.selectedItem_district.code       = district.code;
                        vm.selectedItem_district.$selected  = false;
                        vm.selectedItem_district.$edit      = false;
                        vm.selectedItem_district ={};
                    }
                    else 
                    {    
                      vm.alldistrict = vm.alldistrict.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem_district.id;
                      });
                    }
                }
                else
                {
                  district.nom =  district.nom;
                  district.code=  district.code;
                  district.id  =   String(data.response);              
                  NouvelItem_district=false;
            }
              district.$selected = false;
              district.$edit = false;
              vm.selectedItem_district = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item district
        vm.selection_district= function (item)
        {
            vm.selectedItem_district = item;
            vm.NouvelItem_district   = item;
            currentItem_district     = JSON.parse(JSON.stringify(vm.selectedItem_district));
            if (vm.selectedItem_district.id!='0')
            {
              apiFactory.getAPIgeneraliserREST("commune/index","id_district",item.id).then(function(result)
              {
                  vm.allcommune= result.data.response;
                  vm.boutonAjoutCommune = true; 
                  console.log(vm.allcommune);
              });
            
            }
           //console.log(vm.selectedItem_distric);
        };
        $scope.$watch('vm.selectedItem_district', function()
        {
             if (!vm.alldistrict) return;
             vm.alldistrict.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_district.$selected = true;
        });

        //function cache masque de saisie ajout district
        vm.ajouter_district = function ()
        { 
          if (NouvelItem_district == false)
          {
            var items_district = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;
            NouvelItem_district = true ;        
            vm.alldistrict.push(items_district);
            vm.alldistrict.forEach(function(dist)
            {
              if(dist.$selected==true)
              {
                vm.selectedItem_district = dist;
              }
            });
            vm.boutonAjoutCommune = false; 
            vm.allcommune = [];
          }else
          {
            vm.showAlert('Ajout District','Un formulaire d\'ajout est déjà ouvert!!!');
          }         
                      
        };

        //fonction de bouton d'annulation district
        vm.annuler_district = function(item)
        {
          if (NouvelItem_district == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem_district.code ;
            item.nom       = currentItem_district.nom ; 
          }else
          {
            vm.alldistrict = vm.alldistrict.filter(function(obj)
            {
                return obj.id !== vm.selectedItem_district.id;
            });
          }

          vm.selectedItem_district = {} ;
          NouvelItem_district      = false;
          
        };

        //fonction masque de saisie modification district
        vm.modifier_district = function(item)
        {
            NouvelItem_district = false ;
            vm.selectedItem_district = item;
            currentItem_district = angular.copy(vm.selectedItem_district);
            vm.alldistrict.forEach(function(dist) {
              dist.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem_district.code ;
            item.nom       = vm.selectedItem_district.nom ; 
        };

        //fonction bouton suppression item district
        vm.supprimer_district = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout_district(vm.selectedItem_district,1);
                vm.boutonAjoutCommune = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item region
        function test_existance_district (item,suppression)
        {          
            if (suppression!=1)
            {
               var dist = vm.alldistrict.filter(function(obj)
                {
                   return obj.id == currentItem_district.id;
                });
                if(dist[0])
                {
                   if((dist[0].nom!=currentItem_district.nom) || (dist[0].code!=currentItem_district.code))                    
                      { 
                         insert_in_base_district(item,suppression);
                      }
                      else
                      {  
                        item.$selected = false;
                        item.$edit = false;
                      }
                }
            } else  
                  insert_in_base_district(item,suppression);

        }

        vm.show_district = function()
        {
          vm.showTableDistrict = !vm.showTableDistrict;
        }
        
*/
/* ***************FIN DISTRICT**********************/

/* ***************DEBUT COMMUNE**********************/
       /* function ajout_commune(commune,suppression)
        {
            if (NouvelItem_commune==false)
            {
                test_existance_commune (commune,suppression); 
            } 
            else
            { 
                insert_in_base_commune(commune,suppression);
            }
        }

        //fonction d'insertion ou mise a jours ou suppression item dans bdd commune
        function insert_in_base_commune(commune,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var getId = 0;
            if (NouvelItem_commune==false)
            {
                getId = vm.selectedItem_commune.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      commune.code,
                    nom:       commune.nom,
                    id_district: vm.selectedItem_district.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("commune/index",datas, config).success(function (data)
            {
                if (NouvelItem_commune == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem_commune.nom        = commune.nom;
                        vm.selectedItem_commune.code       = commune.code;
                        vm.selectedItem_commune.$selected  = false;
                        vm.selectedItem_commune.$edit      = false;
                        vm.selectedItem_commune ={};
                    }
                    else 
                    {    
                      vm.allcommune = vm.allcommune.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem_commune.id;
                      });
                    }
                }
                else
                {
                  commune.nom =  commune.nom;
                  commune.code=  commune.code;
                  commune.id  =   String(data.response);              
                  NouvelItem_commune=false;
            }
              commune.$selected = false;
              commune.$edit = false;
              vm.selectedItem_commune = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //fonction selection item commune
        vm.selection_commune= function (item)
        {
            vm.selectedItem_commune = item;
            vm.NouvelItem_commune   = item;
            currentItem_commune     = JSON.parse(JSON.stringify(vm.selectedItem_commune));
            //console.log(vm.selectedItem_distric);
        };
        $scope.$watch('vm.selectedItem_commune', function()
        {
             if (!vm.allcommune) return;
             vm.allcommune.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_commune.$selected = true;
        });

        //function cache masque de saisie ajout commune
        vm.ajouter_commune = function ()
        { 
          if (NouvelItem_commune == false)
          {
            var items_commune = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              nom: ''
            }; 
           // vm.selectedItem.$selected = false;
            NouvelItem_commune = true ;         
            vm.allcommune.push(items_commune);
            vm.allcommune.forEach(function(com)
            {
              if(com.$selected==true)
              {
                vm.selectedItem_commune = com;
              }
            });
          }else
          {
            vm.showAlert('Ajout commune','Un formulaire d\'ajout est déjà ouvert!!!');
          }         
                      
        };

        //fonction de bouton d'annulation commune
        vm.annuler_commune = function(item)
        {
          if (NouvelItem_commune == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem_commune.code ;
            item.nom       = currentItem_commune.nom ; 
          }else
          {
            vm.allcommune = vm.allcommune.filter(function(obj)
            {
                return obj.id !== vm.selectedItem_commune.id;
            });
          }

          vm.selectedItem_commune = {} ;
          NouvelItem_commune      = false;
          
        };

        //fonction masque de saisie modification commune
        vm.modifier_commune = function(item)
        {
            NouvelItem_commune = false ;
            vm.selectedItem_commune = item;
            currentItem_commune = angular.copy(vm.selectedItem_commune);
            vm.allcommune.forEach(function(com) {
              com.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem_commune.code ;
            item.nom       = vm.selectedItem_commune.nom ; 
        };

        //fonction bouton suppression item commune
        vm.supprimer_commune = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout_commune(vm.selectedItem_commune,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item region
        function test_existance_commune (item,suppression)
        {          
            if (suppression!=1)
            {
               var com = vm.allcommune.filter(function(obj)
                {
                   return obj.id == currentItem_commune.id;
                });
                if(com[0])
                {
                   if((com[0].nom!=currentItem_commune.nom) || (com[0].code!=currentItem_commune.code))                    
                      { 
                         insert_in_base_commune(item,suppression);
                      }
                      else
                      {  
                        item.$selected = false;
                        item.$edit = false;
                      }
                }
            } else  
                  insert_in_base_commune(item,suppression);

        }

        vm.show_commune = function()
        {
          vm.showTableCommune = !vm.showTableCommune;
        }
        */

/* ***************FIN COMMUNE**********************/
        
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
