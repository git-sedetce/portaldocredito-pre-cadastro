ARG DOCKER_GID=1000
ARG DOCKER_UID=1000

FROM devilbox/php-fpm-8.0:latest AS php8-fpm

ENV PHP_INI_FILE=/usr/local/etc/php/php.ini
ARG TARGET_ENVIRONMENT=development

# Set evn var to enable xterm terminal
# Set timezone to UTC to avoid tzdata interactive mode during build
ENV TERM=xterm
ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Configure fpm php.ini file
RUN cp $PHP_INI_FILE-$TARGET_ENVIRONMENT $PHP_INI_FILE

WORKDIR /var/www

COPY --from=composer /usr/bin/composer /usr/bin/composer

# PHP dependencies
RUN apt-get update -y && apt-get install -y \
        libxml2-dev autoconf g++ libtool make \
        wget curl unzip bzip2 git libzip-dev \
        libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
        autoconf pkg-config libssl-dev libmongoc-1.0-0 \
        libpq-dev

# MongoDB
RUN pecl install mongodb && echo "extension=mongodb.so" >> $PHP_INI_FILE

RUN docker-php-ext-install zip bcmath sockets pcntl && \
    docker-php-ext-configure gd \
        --enable-gd \
        --with-freetype \
        --with-jpeg && \
    docker-php-ext-install gd opcache pdo_pgsql pgsql && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
    docker-php-ext-install -j$(nproc) gd

RUN pecl config-set php_ini "${PHP_INI_FILE}"

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

RUN rm -rf /var/www/html && chmod -R 777 /var/www

# Add user for laravel application
RUN groupadd -g ${DOCKER_GID:-1000} www
RUN useradd -u ${DOCKER_UID:-1000} -ms /bin/bash -g www www

CMD ["php-fpm"]

FROM php8-fpm AS build

WORKDIR /var/www

# Copy the application files to the container
COPY . .
COPY --chown=www:www . .

RUN mkdir -p bootstrap/cache vendor && \
    chmod 777 -R storage bootstrap/cache vendor

USER www

RUN composer install -vvv && rm -rf /home/www/.composer/cache

CMD ["php-fpm"]
