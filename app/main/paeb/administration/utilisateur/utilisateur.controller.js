(function ()
{
    'use strict';

    angular
        .module('app.paeb.administration.utilisateur')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController(apiFactory, $location, $mdDialog, $scope)
    {
      var vm = this;
      vm.affichageMasqueMdp = 0;
      vm.allSite = [];

      vm.selectedItem = {} ;
      vm.infoAssuj = {} ;

      vm.column = [{"titre":"Nom"},{"titre":"Prénom"},{"titre":"Email"},
      {"titre":"Etat"},{"titre":"Privilège"}];

      vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
    };


      apiFactory.getAPIgeneraliserREST("utilisateurs/index","type_get","findAll").then(function(result) {

        vm.listes_utilisateurs = result.data.response;
console.log(vm.listes_utilisateurs);
      });

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict = result.data.response;
          vm.districts = vm.alldistrict ;
      });

      apiFactory.getAll("cisco/index").then(function(result)
      {
          vm.allcisco = result.data.response;
          vm.ciscos = vm.allcisco ;
      });

     vm.filtre_district = function()
      {
          var ds = vm.alldistrict ;
          if (vm.user.id_region) 
          {
            vm.districts = ds.filter(function(obj)
            {
                return obj.region.id == vm.user.id_region;
            });
          }
                 
      }

      vm.filtre_cisco = function()
      {
          var ds = vm.allcisco ;
          if (vm.user.id_district) 
          {
            vm.ciscos = ds.filter(function(obj)
            {
                return obj.district.id == vm.user.id_district;
            });
          }
                 
      }

      vm.formatMillier = function (nombre) 
      {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
      }
       

      vm.sexe = function (s)
      {
          var x = Number(s);
          switch(x)
          {
              case 1:
              {
                  return "Mr";
                  break;
              }

              case 0:
              {
                  return "Mme";
                  break;
              }

              default:
              {
                  return "Mr/Mme ...?";
                  break;
              }
          }
      }

      
      vm.selection = function (item) 
      {        
        vm.selectedItem = item;
  console.log(item);
        vm.nouvelItem = item;
        //currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
        vm.afficherboutonModifSupr = 1 ;
        vm.user = {} ;
        vm.affichageMasque = 0 ;
        
      };

      function loadAll() 
      {

        var repos = vm.assujettis ;
        return repos.map( function (repo) {
          repo.value = repo.nom.toLowerCase();
      
          return repo;
        });
      }

      function loadAllforPersonnel() 
      {

        var repos = vm.personnels ;

        return repos.map( function (repo) {
          repo.value = repo.nom.toLowerCase();
      
          return repo;
        });
      }

      vm.changerAssujettis = function (item) 
      {
          vm.infoAssuj = item ;

      }

      vm.changerPers = function (item) 
      {
          vm.pers = item ;

      }



        // Fonction utilisées par balise autocomplete
        vm.querySearch = function  (query) {

            vm.repos = loadAll();
          var results = query ? vm.repos.filter( createFilterFor(query) ) : vm.repos,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        vm.querySearchPersonnel = function  (query) {

            vm.reposPers = loadAllforPersonnel();
          var results = query ? vm.reposPers.filter( createFilterFor(query) ) : vm.reposPers,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
          };
        }

    $scope.$watch('vm.selectedItem', function() 
    {
        if (!vm.listes_utilisateurs) return;
        vm.listes_utilisateurs.forEach(function(item) {
          item.$selected = false;
        });
        vm.selectedItem.$selected = true;
    });

      vm.testEnabled = function(valeur)
      {
          switch(valeur)
          {
              case '1':
              {
                  return 'Actif' ;
                  break;
              }
              default :
              {
                  return 'Inactif' ;
                  break;
              }
          }
      }

      vm.modifier = function()
      {
          vm.affichageMasque = 1 ;
          vm.user.id = vm.selectedItem.id ;
          vm.user.nom = vm.selectedItem.nom ;
          vm.user.prenom = vm.selectedItem.prenom ;
          vm.user.telephone = vm.selectedItem.telephone ;
          vm.user.email = vm.selectedItem.email ;
          vm.user.enabled = vm.selectedItem.enabled ;          
                    
         // vm.user.id_district = vm.selectedItem.district.id ;          
         // vm.user.id_cisco = vm.selectedItem.cisco.id ;
          /*vm.user.sigle = vm.selectedItem.sigle ;
		  vm.user.envoi_donnees = parseInt(vm.selectedItem.envoi_donnees) ;*/
      if (vm.selectedItem.region)
      {
        vm.user.id_region = parseInt(vm.selectedItem.region.id);
      }else vm.user.id_region = null;

      if (vm.selectedItem.district)
      {
        vm.user.id_district = parseInt(vm.selectedItem.district.id);
        //if (vm.selectedItem.region.id) {}
        vm.districts = vm.alldistrict.filter(function(obj)
        {
            return obj.region.id == vm.selectedItem.region.id;
        });
      }else vm.user.id_district =null;
          
       if (vm.selectedItem.cisco)
       {
        vm.user.id_cisco = parseInt(vm.selectedItem.cisco.id);
        if (vm.selectedItem.district.id)
        {
          vm.ciscos = vm.allcisco.filter(function(obj)
          {
              return obj.district.id == vm.selectedItem.district.id;
          });
        }
       }else vm.user.id_cisco = null; 
          
         console.log(vm.selectedItem.district);
console.log(vm.ciscos);
          vm.searchText="";
          vm.searchTextPers="";
          

          angular.forEach(vm.selectedItem.roles, function(value, key)
          {
            
              switch(value)
              {
                  case 'USER':
                  {
                      vm.user.user = true ;
                      break ;
                  }

                 /* case 'DDB':
                  {
                      vm.user.ddb = true ;
                      break ;
                  }*/

                  case 'ADMIN':
                  {
                      vm.user.admin = true ;
                      break;
                  }

                  case 'ODAAF':
                  {
                      vm.user.odaaf = true ;
                      break ;
                  }

                  case 'DAAF':
                  {
                      vm.user.daaf = true ;
                      break ;
                  }

                  case 'OBCAF':
                  {
                      vm.user.obcaf = true ;
                      break;
                  }

                  case 'BCAF':
                  {
                      vm.user.bcaf = true ;
                      break;
                  }

                  case 'UFP':
                  {
                      vm.user.ufp = true ;
                      break;
                  }

                  case 'DPFI':
                  {
                      vm.user.dpfi = true ;
                      break;
                  }

                  case 'ODPFI':
                  {
                      vm.user.odpfi = true ;
                      break;
                  }

                  case 'AAC':
                  {
                      vm.user.aac = true ;
                      break;
                  }

                  default:
                  {
                      break ;
                  }
              }  
          });
      }
      vm.supprimer = function() 
      {
        vm.affichageMasque = 0 ;
        vm.afficherboutonModifSupr = 0 ;
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
      }
      vm.ajout = function(user,suppression)
      {
        var tab = [] ;
         

          angular.forEach(user, function(value, key)
          {
        
              if(key == 'user' && value == true)
                  tab.push(key.toUpperCase());
              /*if(key == 'ddb' && value == true)
                tab.push(key.toUpperCase());*/
              if(key == 'admin' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'odaaf' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'daaf' && value == true)
                tab.push(key.toUpperCase());
              if(key == 'obcaf' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'bcaf' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'ufp' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'dpfi' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'odpfi' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'aac' && value == true)
                  tab.push(key.toUpperCase());  
          });

          
          if (suppression == 0) 
          {//update

              var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };

              
              if (!vm.infoAssuj) 
              {
                  vm.infoAssuj = {};
                  vm.infoAssuj.id = "";
              };

              if (!vm.pers) 
              {
                  vm.pers = {};
                  vm.pers.id = "";
              };
              var datas = $.param(
              { 
                  gestion_utilisateur:1,
                  supprimer:suppression,
                  id:vm.selectedItem.id,
                  nom: user.nom,
                  prenom: user.prenom,
                  telephone: user.telephone,                   
                  id_region: user.id_region,
                  id_district: user.id_district,
                  id_cisco: user.id_cisco,                           
                 // sigle: user.sigle,                           
                  email: user.email ,
                  enabled: user.enabled ,
                 // envoi_donnees: user.envoi_donnees ,
                  roles: tab 
                             
                  
              });

console.log(datas);
              apiFactory.add("utilisateurs/index",datas, config)
              .success(function (data) 
              {
                  var cis = vm.ciscos.filter(function(obj)
                  {
                      return obj.id == vm.user.id_cisco;
                  });
                  var dis = vm.districts.filter(function(obj)
                  {
                      return obj.id == vm.user.id_district;
                  });
                  var reg = vm.allregion.filter(function(obj)
                  {
                      return obj.id == vm.user.id_region;
                  });
                  //*******************************confirmation mail
                 /* if (user.enabled == 1) 
                  {
                      apiFactory.getAll("mail/index?actif=4&dest="+user.email).then(function(value) {
                        if(value.status == 200){
                          
                        }
                        //
                      });
                  };*/
                  //*******************************
                  vm.selectedItem.cisco = cis[0] ;
                  vm.selectedItem.district = dis[0] ;
                  vm.selectedItem.region = reg[0] ;
                  vm.selectedItem.roles = tab ;
                  vm.selectedItem.nom = user.nom;
                  vm.selectedItem.email = user.email;
                  vm.selectedItem.prenom = user.prenom;
                  vm.selectedItem.telephone = user.telephone;
                 // vm.selectedItem.sigle = user.sigle;
                  vm.selectedItem.enabled = user.enabled;
                 // vm.selectedItem.envoi_donnees = user.envoi_donnees;
                  //vm.selectedItem.assujettis = vm.infoAssuj;
                  //vm.selectedItem.personnel = vm.pers;

             /*     

                  angular.forEach(vm.allSite, function(value, key)
                  {
                      if (value.id == user.site_id) 
                      {
                          vm.selectedItem.site = value ;
                      };
                    
                  });*/


                  vm.user = {} ;
                  vm.affichageMasque = 0 ;


              })
              .error(function (data) 
              {
                  
              });

          }
          else//delete
          {
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };

              var datas = $.param(
              { 
                  gestion_utilisateur:1,
                  supprimer:suppression,
                  id:vm.selectedItem.id
                             
                  
              });
              apiFactory.add("utilisateurs/index",datas, config)
              .success(function (data) 
              {
                  vm.listes_utilisateurs = vm.listes_utilisateurs.filter(function(obj) {
            
                    return obj.id !== vm.selectedItem.id;
                  });
              })
              .error(function (data) 
              {
                  
              });
          }


          

      }

      vm.annuler = function()
      {
          vm.user = {} ;
          vm.affichageMasque = 0 ;
      }
      vm.change_aac = function(item)
      {
        if (item.aac==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_obcaf = function(item)
      {
        if (item.obcaf==true) 
        {
          item.aac = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_bcaf = function(item)
      {
        if (item.bcaf==true) 
        {
          item.obcaf = false;
          item.aac = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_odaaf = function(item)
      {
        if (item.odaaf==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.aac = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_daaf = function(item)
      {
        if (item.daaf==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.aac = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_odpfi = function(item)
      {
        if (item.odpfi==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.aac = false;
          item.dpfi = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_dpfi = function(item)
      {
        if (item.dpfi==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.aac = false;
          item.ufp = false;
          item.admin = false;
        }
      }
      vm.change_ufp = function(item)
      {
        if (item.ufp==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.aac = false;
          item.admin = false;
        }
      }
      vm.change_admin = function(item)
      {
        if (item.admin==true) 
        {
          item.obcaf = false;
          item.bcaf = false;
          item.odaaf = false;
          item.daaf = false;
          item.odpfi = false;
          item.dpfi = false;
          item.ufp = false;
          item.aac = false;
        }
      } 
      vm.changer_mpd_form = function(item)
      {
        vm.affichageMasqueMdp = 1;
      }
       
      vm.annulerChanger_mdp = function()
      {
        vm.affichageMasqueMdp = 0;
        vm.profil = {};
      }

      vm.changer_mdp = function(profil)
  		{
  		
  			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var datas = $.param(
            {
            	profil:1,
                id:vm.selectedItem.id,      
                nom: vm.selectedItem.nom,
                prenom: vm.selectedItem.prenom,
               // cin: vm.selectedItem.cin,
                email: vm.selectedItem.email,
                password: profil.mdp
                
            });

            apiFactory.add("utilisateurs/index",datas, config)
                .success(function (data) 
                {
                    // console.log('update');
                    var confirm = $mdDialog.confirm()
                        .title('Mis à jour du compte avec succès!')
                        .textContent('Votre nouveau mot de passe est : '+profil.mdp)
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('ok');
                    $mdDialog.show(confirm).then(function() {
                    
                    vm.affichageMasqueMdp = 0;
                    vm.profil={};
                    }, function() {
                    //alert('rien');
                    });

                });
  		}
      
    }
})();
