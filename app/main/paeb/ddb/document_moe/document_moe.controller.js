(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document_moe')
        .controller('Document_moeController', Document_moeController);
    /** @ngInject */
    function Document_moeController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alldocument_moe = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.document_moe_column = [{titre:"code"},{titre:"intitule"},{titre:"Action"}];
        
        //recuperation donnée document_moe
        apiFactory.getAll("document_moe/index").then(function(result)
        {
            vm.alldocument_moe = result.data.response; 
            //console.log(vm.alldocument_moe);
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
            vm.alldocument_moe.push(items);
            vm.alldocument_moe.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout document_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(document_moe,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (document_moe,suppression); 
            } 
            else
            {
                insert_in_base(document_moe,suppression);
            }
        }

        //fonction de bouton d'annulation document_moe
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
            vm.alldocument_moe = vm.alldocument_moe.filter(function(obj)
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
           // vm.alldocument_moe= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alldocument_moe) return;
             vm.alldocument_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item document_moe
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alldocument_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.intitule       = vm.selectedItem.intitule; 
        };

        //fonction bouton suppression item document_moe
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

        //function teste s'il existe une modification item document_moe
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.alldocument_moe.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd document_moe
        function insert_in_base(document_moe,suppression)
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
                    code:      document_moe.code,
                    intitule: document_moe.intitule              
                });
                console.log(datas);
                //factory
            apiFactory.add("document_moe/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.intitule        = document_moe.intitule;
                       vm.selectedItem.code       = document_moe.code;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alldocument_moe = vm.alldocument_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  document_moe.intitule =  document_moe.intitule;
                  document_moe.code=  document_moe.code;
                  document_moe.id  =   String(data.response);              
                  NouvelItem=false;
            }
              document_moe.$selected = false;
              document_moe.$edit = false;
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
