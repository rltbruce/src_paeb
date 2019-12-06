(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.association')
        .controller('AssociationController', AssociationController);
    /** @ngInject */
    function AssociationController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allassociation = [] ;

        vm.allcommune = [] ;
        vm.allcisco = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.association_column = [{titre:"Code"},{titre:"Description"},{titre:"Ecole"},{titre:"Action"}];
        
        //recuperation donnée association
        apiFactory.getAll("association/index").then(function(result)
        {
            vm.allassociation = result.data.response; 
            //console.log(vm.allassociation);
        });

        //recuperation donnée cisco
        apiFactory.getAll("ecole/index").then(function(result)
        {
          vm.allecole= result.data.response;
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
              code: '',
              description: '',
              id_ecole: ''
            };         
            vm.allassociation.push(items);
            vm.allassociation.forEach(function(asso)
            {
              if(asso.$selected==true)
              {
                vm.selectedItem = asso;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout association','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(association,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (association,suppression); 
            } 
            else
            {
                insert_in_base(association,suppression);
            }
        }

        //fonction de bouton d'annulation association
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.description   = currentItem.description ;
            item.id_ecole      = currentItem.id_ecole; 
          }else
          {
            vm.allassociation = vm.allassociation.filter(function(obj)
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
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allassociation) return;
             vm.allassociation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item association
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allassociation.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.description = vm.selectedItem.description;
            item.id_ecole  = vm.selectedItem.ecole.id; 
        };

        //fonction bouton suppression item association
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enassociationistrement ?')
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

        //function teste s'il existe une modification item association
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allassociation.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].code!=currentItem.code)
                    || (cis[0].id_ecole!=currentItem.id_ecole))                    
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

        //insertion ou mise a jours ou suppression item dans bdd association
        function insert_in_base(association,suppression)
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
                    code:      association.code,
                    description: association.description,
                    id_ecole: association.id_ecole                
                });
                //console.log(association.pays_id);
                //factory
            apiFactory.add("association/index",datas, config).success(function (data)
            {
                
                var eco = vm.allecole.filter(function(obj)
                {
                    return obj.id == association.id_ecole;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = association.description;
                        vm.selectedItem.code       = association.code;
                        vm.selectedItem.ecole       = eco[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allassociation = vm.allassociation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  association.description =  association.description;
                  association.code=  association.code;
                  association.commune = eco[0];
                  association.id  =   String(data.response);              
                  NouvelItem=false;
            }
              association.$selected = false;
              association.$edit = false;
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
