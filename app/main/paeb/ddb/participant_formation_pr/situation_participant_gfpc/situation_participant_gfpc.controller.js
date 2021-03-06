(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.participant_formation_pr.situation_participant_gfpc')
        .controller('Situation_participant_gfpcController', Situation_participant_gfpcController);
    /** @ngInject */
    function Situation_participant_gfpcController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allsituation_participant_gfpc = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.situation_participant_gfpc_column = [{titre:"Libelle"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée situation_participant_gfpc
        apiFactory.getAll("situation_participant_gfpc/index").then(function(result)
        {
            vm.allsituation_participant_gfpc = result.data.response; 
            //console.log(vm.allsituation_participant_gfpc);
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
              libelle: '',
              description: ''
            };         
            vm.allsituation_participant_gfpc.push(items);
            vm.allsituation_participant_gfpc.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout situation_participant_gfpc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(situation_participant_gfpc,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (situation_participant_gfpc,suppression); 
            } 
            else
            {
                insert_in_base(situation_participant_gfpc,suppression);
            }
        }

        //fonction de bouton d'annulation situation_participant_gfpc
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.libelle      = currentItem.libelle ;
            item.description       = currentItem.description ; 
          }else
          {
            vm.allsituation_participant_gfpc = vm.allsituation_participant_gfpc.filter(function(obj)
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
           // vm.allsituation_participant_gfpc= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allsituation_participant_gfpc) return;
             vm.allsituation_participant_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item situation_participant_gfpc
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allsituation_participant_gfpc.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.libelle      = vm.selectedItem.libelle ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item situation_participant_gfpc
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

        //function teste s'il existe une modification item situation_participant_gfpc
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allsituation_participant_gfpc.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].libelle!=currentItem.libelle))                    
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

        //insertion ou mise a jours ou suppression item dans bdd situation_participant_gfpc
        function insert_in_base(situation_participant_gfpc,suppression)
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
                    libelle:      situation_participant_gfpc.libelle,
                    description: situation_participant_gfpc.description              
                });
                console.log(datas);
                //factory
            apiFactory.add("situation_participant_gfpc/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = situation_participant_gfpc.description;
                       vm.selectedItem.libelle       = situation_participant_gfpc.libelle;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allsituation_participant_gfpc = vm.allsituation_participant_gfpc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  situation_participant_gfpc.description =  situation_participant_gfpc.description;
                  situation_participant_gfpc.libelle=  situation_participant_gfpc.libelle;
                  situation_participant_gfpc.id  =   String(data.response);              
                  NouvelItem=false;
            }
              situation_participant_gfpc.$selected = false;
              situation_participant_gfpc.$edit = false;
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
