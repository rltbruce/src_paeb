(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.decaiss_fonct_feffi')
    //.controller('DialogController', DialogController)
        .controller('Decaiss_fonct_feffiController', Decaiss_fonct_feffiController);
    /** @ngInject */
    function Decaiss_fonct_feffiController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;

        vm.selectedItemFeffi = {} ;
        vm.allfeffi = [] ;

        vm.allconvention_entete= [] ;        

        vm.ajoutDecaiss_fonct_feffi = ajoutDecaiss_fonct_feffi;
        var NouvelItemDecaiss_fonct_feffi=false;
        var currentItemDecaiss_fonct_feffi;
        vm.selectedItemDecaiss_fonct_feffi = {} ;
        vm.alldecaiss_fonct_feffi = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemDecaiss_fonct_feffi_valide = {} ;
        vm.alldecaiss_fonct_feffi_valide = [] ;
        vm.alldocument_feffi =[];

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;
        vm.myFile = [] ;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };



/**********************************fin justificatif attachement****************************************/
        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_entete = result.data.response; 
                console.log(vm.allconvention_entete);
            });

            apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.alldecaiss_fonct_feffi = result.data.response; 
                console.log(vm.alldecaiss_fonct_feffi);
            });
          }
          

        });

        //Masque de saisi ajout
        vm.ajouterDecaiss_fonct_feffi= function ()
        { 
          
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant: '',
              date_decaissement: '',
              observation: '',
              id_convention_entete: ''
            };
        
            vm.alldecaiss_fonct_feffi.push(items);
            vm.alldecaiss_fonct_feffi.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDecaiss_fonct_feffi = mem;
              }
            });

            NouvelItemDecaiss_fonct_feffi = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout decaiss_fonct_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                test_existanceDecaiss_fonct_feffi (decaiss_fonct_feffi,suppression); 
            } 
            else
            {
                insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation decaiss_fonct_feffi
        vm.annulerDecaiss_fonct_feffi = function(item)
        {
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant   = currentItemDecaiss_fonct_feffi.montant ;
            item.date_decaissement   = currentItemDecaiss_fonct_feffi.date_decaissement ;
            item.observation   = currentItemDecaiss_fonct_feffi.observation ;
            item.id_convention_entete   = currentItemDecaiss_fonct_feffi.id_convention_entete ;
          }else
          {
            vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
            });
          }

          vm.selectedItemDecaiss_fonct_feffi = {} ;
          NouvelItemDecaiss_fonct_feffi      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDecaiss_fonct_feffi= function (item)
        {
            vm.selectedItemDecaiss_fonct_feffi = item;
            vm.nouvelItemDecaiss_fonct_feffi   = item;
            currentItemDecaiss_fonct_feffi    = JSON.parse(JSON.stringify(vm.selectedItemDecaiss_fonct_feffi));
            if(item.id!=0)
            {
              vm.showbuttonValidation = true;
            }
            
        };
        $scope.$watch('vm.selectedItemDecaiss_fonct_feffi', function()
        {
             if (!vm.alldecaiss_fonct_feffi) return;
             vm.alldecaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDecaiss_fonct_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDecaiss_fonct_feffi = function(item)
        {
            NouvelItemDecaiss_fonct_feffi = false ;
            vm.selectedItemDecaiss_fonct_feffi = item;
            currentItemDecaiss_fonct_feffi = angular.copy(vm.selectedItemDecaiss_fonct_feffi);
            $scope.vm.alldecaiss_fonct_feffi.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.montant   = parseInt(vm.selectedItemDecaiss_fonct_feffi.montant);
            item.date_decaissement   = new Date(vm.selectedItemDecaiss_fonct_feffi.date_decaissement) ;
            item.observation   = vm.selectedItemDecaiss_fonct_feffi.observation ;
            item.id_convention_entete   = vm.selectedItemDecaiss_fonct_feffi.convention_entete.id ;
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item decaiss_fonct_feffi
        vm.supprimerDecaiss_fonct_feffi = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutDecaiss_fonct_feffi(vm.selectedItemDecaiss_fonct_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDecaiss_fonct_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldecaiss_fonct_feffi.filter(function(obj)
                {
                   return obj.id == currentItemDecaiss_fonct_feffi.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant   != currentItemDecaiss_fonct_feffi.montant )
                    ||(mem[0].date_decaissement   != currentItemDecaiss_fonct_feffi.date_decaissement )
                    ||(mem[0].observation   != currentItemDecaiss_fonct_feffi.observation )
                    ||(mem[0].id_convention_entete   != currentItemDecaiss_fonct_feffi.convention_entete.id ))                   
                      { 
                         insert_in_baseDecaiss_fonct_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDecaiss_fonct_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd decaiss_fonct_feffi
        function insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                getId = vm.selectedItemDecaiss_fonct_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant: decaiss_fonct_feffi.montant,
                    date_decaissement: convertionDate(new Date(decaiss_fonct_feffi.date_decaissement)),
                    observation: decaiss_fonct_feffi.observation,
                    id_convention_entete: decaiss_fonct_feffi.id_convention_entete,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("decaiss_fonct_feffi/index",datas, config).success(function (data)
            {   
              var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == decaiss_fonct_feffi.id_convention_entete;
                });

              if (NouvelItemDecaiss_fonct_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemDecaiss_fonct_feffi.convention_entete = conv[0];
                        vm.selectedItemDecaiss_fonct_feffi.$selected  = false;
                        vm.selectedItemDecaiss_fonct_feffi.$edit      = false;
                        vm.selectedItemDecaiss_fonct_feffi ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {   
                  decaiss_fonct_feffi.convention_entete = conv[0];
                  decaiss_fonct_feffi.id  =   String(data.response);              
                  NouvelItemDecaiss_fonct_feffi = false;
                                        
               }
              
              decaiss_fonct_feffi.$selected = false;
              decaiss_fonct_feffi.$edit = false;
              vm.selectedItemDecaiss_fonct_feffi = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDecaiss_fonct_feffi = function()
        {
          maj_in_baseDecaiss_fonct_feffi(vm.selectedItemDecaiss_fonct_feffi,0);
        }

        //insertion ou mise a jours ou suppression item dans bdd decaiss_fonct_feffi
        function maj_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        decaiss_fonct_feffi.id,
                    montant: decaiss_fonct_feffi.montant,
                    date_decaissement: convertionDate(new Date(decaiss_fonct_feffi.date_decaissement)),
                    observation: decaiss_fonct_feffi.observation,
                    id_convention_entete: decaiss_fonct_feffi.convention_entete.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("decaiss_fonct_feffi/index",datas, config).success(function (data)
            {   

              vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
              {
                return obj.id !== decaiss_fonct_feffi.id;
              });
              
              vm.selectedItemDecaiss_fonct_feffi = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin justificatif batiment****************************************/

/**********************************fin mpe_sousmissionnaire****************************************/
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

        function convertionDate(daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
      {   
        if(daty)
        {
            var date     = new Date(daty);
            var jour  = date.getDate();
            var mois  = date.getMonth()+1;
            var annee = date.getFullYear();
            if(mois <10)
            {
                mois = '0' + mois;
            }
            if(jour <10)
            {
                jour = '0' + jour;
            }
            var date_final= jour+"/"+mois+"/"+annee;
            return date_final
        }      
      }
    }
  
})();
