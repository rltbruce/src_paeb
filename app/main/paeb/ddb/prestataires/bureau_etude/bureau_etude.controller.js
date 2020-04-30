(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires.bureau_etude')
        .controller('Bureau_etudeController', Bureau_etudeController);
    /** @ngInject */
    function Bureau_etudeController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allbureau_etude = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.bureau_etude_column = [{titre:"Nom"},{titre:"Nif"},{titre:"Stat"},{titre:"Siege"},{titre:"telephone"},{titre:"Action"}];
        
        //recuperation donnée bureau_etude
        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allbureau_etude = result.data.response; 
            //console.log(vm.allbureau_etude);
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
              nom: '',         
              nif: '',
              stat: '',         
              siege: '',
              telephone: ''
            };         
            vm.allbureau_etude.push(items);
            vm.allbureau_etude.forEach(function(pres)
            {
              if(pres.$selected==true)
              {
                vm.selectedItem = pres;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout bureau_etude','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(bureau_etude,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (bureau_etude,suppression); 
            } 
            else
            {
                insert_in_base(bureau_etude,suppression);
            }
        }

        //fonction de bouton d'annulation bureau_etude
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.telephone = currentItem.telephone ;
            item.nom  = currentItem.nom  ;
            item.nif  = currentItem.nif ; 
            item.stat = currentItem.stat ; 
            item.siege= currentItem.siege ;  
          }else
          {
            vm.allbureau_etude = vm.allbureau_etude.filter(function(obj)
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
           // vm.allbureau_etude= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allbureau_etude) return;
             vm.allbureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item bureau_etude
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allbureau_etude.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.telephone      = vm.selectedItem.telephone ;
            item.nom       = vm.selectedItem.nom;
            item.nif       = vm.selectedItem.nif ;
            item.stat      = vm.selectedItem.stat ;
            item.siege     = vm.selectedItem.siege ; 
        };

        //fonction bouton suppression item bureau_etude
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enbureau_etudeistrement ?')
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

        //function teste s'il existe une modification item bureau_etude
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allbureau_etude.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].nom!=currentItem.nom) 
                    || (cis[0].telephone!=currentItem.telephone)
                    || (cis[0].nif!=currentItem.nif)
                    || (cis[0].stat!=currentItem.stat)
                    || (cis[0].siege!=currentItem.siege))                    
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

        //insertion ou mise a jours ou suppression item dans bdd bureau_etude
        function insert_in_base(bureau_etude,suppression)
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
                    id:     getId,      
                    telephone:   bureau_etude.telephone,
                    nom:    bureau_etude.nom,      
                    nif:    bureau_etude.nif,      
                    stat:   bureau_etude.stat,      
                    siege:  bureau_etude.siege,               
                });
                //console.log(bureau_etude.pays_id);
                //factory
            apiFactory.add("bureau_etude/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = bureau_etude.nom;
                        vm.selectedItem.telephone       = bureau_etude.telephone;
                        vm.selectedItem.nif       = bureau_etude.nif;
                        vm.selectedItem.stat       = bureau_etude.stat;
                        vm.selectedItem.siege       = bureau_etude.siege;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allbureau_etude = vm.allbureau_etude.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  bureau_etude.nom =  bureau_etude.nom;
                  bureau_etude.telephone=  bureau_etude.telephone;
                  bureau_etude.nif =  bureau_etude.nif;
                  bureau_etude.stat=  bureau_etude.stat;
                  bureau_etude.siege =  bureau_etude.siege;
                  bureau_etude.id  =   String(data.response);              
                  NouvelItem=false;
            }
              bureau_etude.$selected = false;
              bureau_etude.$edit = false;
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
