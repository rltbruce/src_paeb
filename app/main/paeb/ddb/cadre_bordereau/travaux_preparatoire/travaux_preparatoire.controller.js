(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cadre_bordereau.travaux_preparatoire')
        .controller('Travaux_preparatoireController', Travaux_preparatoireController);
    /** @ngInject */
    function Travaux_preparatoireController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltravaux_preparatoire = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.travaux_preparatoire_column = [{titre:"Numero"},{titre:"Designation"},{titre:"Unite"},{titre:"Quantite prevu"},{titre:"Action"}];
        
        //recuperation donnée travaux_preparatoire
        apiFactory.getAll("travaux_preparatoire/index").then(function(result)
        {
            vm.alltravaux_preparatoire = result.data.response; 
            //console.log(vm.alltravaux_preparatoire);
        });


        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              designation: '',
              unite: '',
              qt_prevu: '',
              numero: ''
            };         
            vm.alltravaux_preparatoire.push(items);
            vm.alltravaux_preparatoire.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout travaux_preparatoire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(travaux_preparatoire,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (travaux_preparatoire,suppression); 
            } 
            else
            {
                insert_in_base(travaux_preparatoire,suppression);
            }
        }

        //fonction de bouton d'annulation travaux_preparatoire
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.designation      = currentItem.designation ;
            item.unite       = currentItem.unite ; 
            item.qt_prevu       = currentItem.qt_prevu ; 
            item.numero       = currentItem.numero ;
          }else
          {
            vm.alltravaux_preparatoire = vm.alltravaux_preparatoire.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.alltravaux_preparatoire= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltravaux_preparatoire) return;
             vm.alltravaux_preparatoire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item travaux_preparatoire
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltravaux_preparatoire.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.designation      = vm.selectedItem.designation ;
            item.unite       = vm.selectedItem.unite; 
            item.qt_prevu       = vm.selectedItem.qt_prevu; 
            item.numero       = vm.selectedItem.numero;
        };

        //fonction bouton suppression item travaux_preparatoire
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
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item travaux_preparatoire
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.alltravaux_preparatoire.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].unite!=currentItem.unite) 
                    || (cis[0].designation!=currentItem.designation)
                    || (cis[0].qt_prevu!=currentItem.qt_prevu)
                    || (cis[0].numero!=currentItem.numero))                    
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

        //insertion ou mise a jours ou suppression item dans bdd travaux_preparatoire
        function insert_in_base(travaux_preparatoire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    designation:      travaux_preparatoire.designation,
                    unite: travaux_preparatoire.unite,
                    qt_prevu: travaux_preparatoire.qt_prevu,
                    numero: travaux_preparatoire.numero              
                });
                console.log(datas);
                //factory
            apiFactory.add("travaux_preparatoire/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltravaux_preparatoire = vm.alltravaux_preparatoire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  travaux_preparatoire.id  =   String(data.response);              
                  NouvelItem=false;
            }
              travaux_preparatoire.$selected = false;
              travaux_preparatoire.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

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
