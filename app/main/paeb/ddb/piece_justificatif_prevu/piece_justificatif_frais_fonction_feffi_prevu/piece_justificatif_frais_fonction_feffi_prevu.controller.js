(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.piece_justificatif_prevu.piece_justificatif_frais_fonction_feffi_prevu')
        .controller('Piece_justificatif_frais_fonction_feffi_prevuController', Piece_justificatif_frais_fonction_feffi_prevuController);
    /** @ngInject */
    function Piece_justificatif_frais_fonction_feffi_prevuController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allpiece_justificatif_frais_fonction_feffi_prevu = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };


        //col table
        vm.piece_justificatif_frais_fonction_feffi_prevu_column = [{titre:"code"},{titre:"intitule"},{titre:"Action"}];
        apiFactory.getAll("piece_justificatif_frais_fonction_feffi_prevu/index").then(function(result)
        {
          vm.allpiece_justificatif_frais_fonction_feffi_prevu= result.data.response;
         
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
              intitule: ''
            };         
            vm.allpiece_justificatif_frais_fonction_feffi_prevu.push(items);
            vm.allpiece_justificatif_frais_fonction_feffi_prevu.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout piece_justificatif_frais_fonction_feffi_prevu','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(piece_justificatif_frais_fonction_feffi_prevu,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (piece_justificatif_frais_fonction_feffi_prevu,suppression); 
            } 
            else
            {
                insert_in_base(piece_justificatif_frais_fonction_feffi_prevu,suppression);
            }
        }

        //fonction de bouton d'annulation piece_justificatif_frais_fonction_feffi_prevu
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.intitule       = currentItem.intitule ; 
          }else
          {
            vm.allpiece_justificatif_frais_fonction_feffi_prevu = vm.allpiece_justificatif_frais_fonction_feffi_prevu.filter(function(obj)
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
           // vm.allpiece_justificatif_frais_fonction_feffi_prevu= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allpiece_justificatif_frais_fonction_feffi_prevu) return;
             vm.allpiece_justificatif_frais_fonction_feffi_prevu.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item piece_justificatif_frais_fonction_feffi_prevu
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allpiece_justificatif_frais_fonction_feffi_prevu.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.intitule       = vm.selectedItem.intitule; 
        };

        //fonction bouton suppression item piece_justificatif_frais_fonction_feffi_prevu
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

        //function teste s'il existe une modification item piece_justificatif_frais_fonction_feffi_prevu
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allpiece_justificatif_frais_fonction_feffi_prevu.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].intitule!=currentItem.intitule) 
                    || (cis[0].code!=currentItem.code))                    
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

        //insertion ou mise a jours ou suppression item dans bdd piece_justificatif_frais_fonction_feffi_prevu
        function insert_in_base(piece_justificatif_frais_fonction_feffi_prevu,suppression)
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
                    code:      piece_justificatif_frais_fonction_feffi_prevu.code,
                    intitule: piece_justificatif_frais_fonction_feffi_prevu.intitule              
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_frais_fonction_feffi_prevu/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.intitule        = piece_justificatif_frais_fonction_feffi_prevu.intitule;
                       vm.selectedItem.code       = piece_justificatif_frais_fonction_feffi_prevu.code;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allpiece_justificatif_frais_fonction_feffi_prevu = vm.allpiece_justificatif_frais_fonction_feffi_prevu.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  piece_justificatif_frais_fonction_feffi_prevu.intitule =  piece_justificatif_frais_fonction_feffi_prevu.intitule;
                  piece_justificatif_frais_fonction_feffi_prevu.code=  piece_justificatif_frais_fonction_feffi_prevu.code;
                  piece_justificatif_frais_fonction_feffi_prevu.id  =   String(data.response);              
                  NouvelItem=false;
            }
              piece_justificatif_frais_fonction_feffi_prevu.$selected = false;
              piece_justificatif_frais_fonction_feffi_prevu.$edit = false;
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
