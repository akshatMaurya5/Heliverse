angular
  .module("userApp", ["ui.bootstrap"])
  .controller("UserController", function ($scope, $http, $filter) {
    $scope.users = [];
    $scope.filteredUsers = [];
    $scope.filterDomain = "";
    $scope.filterGender = "";
    $scope.filterAvailability = "";
    $scope.displayedUsers = [];
    $scope.teamMembers = [];

    $http
      .get("data.json")
      .then(function (response) {
        $scope.users = response.data;
        $scope.initializePagination();
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    $scope.usersPerPage = 20;
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.numPages = 1;

    $scope.initializePagination = function () {
      $scope.filteredUsers = angular.copy($scope.users);

      $scope.totalItems = $scope.filteredUsers.length;
      $scope.numPages = Math.ceil($scope.totalItems / $scope.usersPerPage);
      $scope.displayedUsers = $scope.getUsers($scope.currentPage);
    };

    $scope.getUsers = function (page) {
      var startIndex = (page - 1) * $scope.usersPerPage;
      return $scope.filteredUsers.slice(
        startIndex,
        startIndex + $scope.usersPerPage
      );
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.numPages) {
        $scope.currentPage++;
        $scope.displayedUsers = $scope.getUsers($scope.currentPage);
      }
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.displayedUsers = $scope.getUsers($scope.currentPage);
      }
    };

    $scope.searchUser = function () {
      $scope.filteredUsers = $filter("filter")($scope.users, {
        first_name: $scope.searchName,
        domain: $scope.filterDomain,
        gender: $scope.filterGender,
        available: $scope.filterAvailability,
      });

      $scope.displayedUsers = $scope.getUsers($scope.currentPage);

      $scope.totalItems = $scope.filteredUsers.length;
      $scope.numPages = Math.ceil($scope.totalItems / $scope.usersPerPage);
      $scope.currentPage = 1;
    };

    $scope.createTeam = function () {
      $scope.searchName = "";
      $scope.domainFilter = "";
      $scope.filterGender = "";
      $scope.filterAvailability = "";

      $scope.teamMembers = [];

      var domainMap = {};

      for (var i = 0; i < $scope.filteredUsers.length; i++) {
        var user = $scope.filteredUsers[i];

        if (user.available) {
          if (!(user.domain in domainMap)) {
            domainMap[user.domain] = true;
            $scope.teamMembers.push(user);
          }
        }
      }

      $scope.displayedUsers = $scope.teamMembers;

      $scope.totalItems = $scope.teamMembers.length;
      $scope.numPages = Math.ceil($scope.totalItems / $scope.usersPerPage);
      $scope.currentPage = 1;
    };
  });
